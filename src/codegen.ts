import type { ApiEndpoint, TransformField } from './types'
import type { Type } from 'ts-morph'

export function generateTransformCode(endpoints: ApiEndpoint[]): string {
	return `
import type { FetchResult } from '#app'
import type { NitroFetchRequest, AvailableRouterMethod } from 'nitropack/types'

export type TransformRoutes = Extract<NitroFetchRequest, keyof typeof transforms>
export type TransformRouteMethods<ReqT extends TransformRoutes> = AvailableRouterMethod<ReqT>
export type TransformFetchResult<ReqT extends TransformRoutes, Method extends TransformRouteMethods<ReqT>> = ReturnType<typeof transforms[ReqT][Method]>

export const transforms = {
${Array.from(new Set(endpoints.map((e) => e.path))).map((path) => {
	const pathEndpoints = endpoints.filter((e) => e.path === path)
	return `	'${path}': {
${pathEndpoints.map(({ method, filePath, responseType }) => {
	const transforms: TransformField[] = []
	analyzeType(responseType, [], transforms)

	if (!transforms.length) {
		return `		'${method}': (data: FetchResult<'${path}', '${method}'>): FetchResult<'${path}', '${method}'> => data`
	}

	const transformsByContainer = transforms.reduce((acc, transform) => {
		const containerKey = transform.isArray
			? transform.containerPath.join('.')
			: 'root'
		if (!acc[containerKey]) {
			acc[containerKey] = []
		}
		acc[containerKey].push(transform)
		return acc
	}, {} as Record<string, TransformField[]>)

	return `		'${method}': (data: FetchResult<'${path}', '${method}'>): Awaited<ReturnType<typeof import('../server/${filePath}').default>> => {
			if (!data) return data
			const transformed = structuredClone(data) as unknown as NonNullable<Awaited<ReturnType<typeof import('../server/${filePath}').default>>>

${Object.entries(transformsByContainer).map(([containerKey, fields]) => {
	if (!fields || !fields.length) return ''

	if (containerKey === 'root') {
		return fields.map((field) => {
			const fullPath = field.path.map((p) => p === '[]' ? '' : `['${p}']`).join('')
			return `			if (transformed${fullPath}) {
				transformed${fullPath} = new Date(transformed${fullPath})
			}`
		}).join('\n')
	}

	const containerPath = fields[0]?.containerPath
	if (!containerPath) return ''

	const containerPathStr = containerPath.map((p) => p === '[]' ? '' : `['${p}']`).join('')

	return `			if (transformed${containerPathStr}) {
				for (let i = 0; i < transformed${containerPathStr}.length; i++) {
					const item = transformed${containerPathStr}[i]
					if (!item) continue
${fields.map((field) => {
	const remainingPath = field.path.slice(containerPath.length).map((p) => p === '[]' ? '' : `['${p}']`).join('')
	return `					if (item${remainingPath}) {
						transformed${containerPathStr}[i]!${remainingPath} = new Date(item${remainingPath})
					}`
}).join('\n')}
				}
			}`
}).filter(Boolean).join('\n\n')}

			return transformed
		}`
}).join(',\n')}
	}`
}).join(',\n')}
}

export default transforms
`.trim()
}

function analyzeType(type: Type, currentPath: string[], transforms: TransformField[]): void {
	if (type.getText() === 'Date') {
		let containerPath: string[] = []
		let isArray = false

		for (let i = currentPath.length - 1; i >= 0; i--) {
			const segment = currentPath[i]
			if (segment === '[]') {
				containerPath = currentPath.slice(0, i + 1)
				isArray = true
				break
			}
		}

		transforms.push({
			path: currentPath,
			isArray,
			containerPath,
			transformType: 'date',
		})
		return
	}

	if (type.isArray()) {
		const elementType = type.getArrayElementType()
		if (elementType) {
			analyzeType(elementType, [...currentPath, '[]'], transforms)
		}
		return
	}

	if (type.isObject()) {
		const properties = type.getProperties()
		for (const prop of properties) {
			const propDeclaration = prop.getDeclarations()[0]
			if (!propDeclaration) continue

			const propType = prop.getTypeAtLocation(propDeclaration)
			analyzeType(propType, [...currentPath, prop.getName()], transforms)
		}
	}
}
