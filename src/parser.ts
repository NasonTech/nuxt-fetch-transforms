import type { ApiEndpoint } from './types'

import { join } from 'node:path'

import { useNuxt } from '@nuxt/kit'

import { Project } from 'ts-morph'

export async function parseApi(): Promise<ApiEndpoint[]> {
	const nuxt = useNuxt()

	// Initialize project
	const tsConfigFilePath = join(nuxt.options.rootDir, '.nuxt', 'tsconfig.server.json')
	const project = new Project({ tsConfigFilePath })

	// Get all API files
	const apiSourceFiles = project.getSourceFiles([
		`${nuxt.options.rootDir}/server/api/**/*.ts`,
		`${nuxt.options.rootDir}/server/routes/**/*.ts`,
	])

	// Parse routes and generate interface
	const apiEndpoints = apiSourceFiles.map((apiSourceFile) => {
		const apiSourceFilePath = apiSourceFile.getFilePath()
		const relativePath = apiSourceFilePath.replace(nuxt.options.serverDir + '/', '')

		const route = parseRoute(relativePath)
		if (!route) return null

		const defaultExport = apiSourceFile.getDefaultExportSymbol()
		if (!defaultExport) {
			return null
		}

		const typeSource = `NonNullable<Awaited<ReturnType<typeof import('../../server/${relativePath}').default>>>`
		const typeSourceFileName = join(nuxt.options.rootDir, '.nuxt', 'types', `${route.path.replaceAll('/', '_')}.${route.method}.ts`)
		const typeSourceFile = project.createSourceFile(typeSourceFileName, '', { overwrite: true })
		const responseType = typeSourceFile.addTypeAlias({ name: 'R', type: typeSource }).getType()

		if (!responseType) return null

		return {
			...route,
			responseType,
		}
	}).filter((apiEndpoint) => apiEndpoint !== null)

	return apiEndpoints
}

function parseRoute(filePath: string) {
	// Remove .ts extension
	const pathWithoutExt = filePath.replace(/\.ts$/, '')
	const segments = pathWithoutExt.split('/')

	// Handle empty path
	if (segments.length === 0) return null

	// Check if this is an index file
	const isIndex = segments[segments.length - 1] === 'index'
	if (isIndex) {
		segments.pop() // Remove 'index'
	}

	// Get the last segment for method detection
	const lastSegment = segments[segments.length - 1]
	if (!lastSegment) return null

	// Parse method from filename (e.g., 'users.post' -> method: 'post')
	const [routePart, method] = lastSegment.split('.')
	if (!routePart) return null

	// Update the last segment to remove the method
	segments[segments.length - 1] = routePart

	// Convert path segments (e.g., [id] -> :id)
	const apiPath = segments
		.map((segment) => {
			if (segment.startsWith('[') && segment.endsWith(']')) {
				return `:${segment.slice(1, -1)}`
			}
			return segment
		})
		.join('/')

	return {
		filePath,
		path: `/${apiPath}`,
		method: method || 'get',
	}
}
