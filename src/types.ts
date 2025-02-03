import type { Type } from 'ts-morph'

export interface ApiEndpoint {
	path: string
	method: string
	responseType: Type
	filePath: string
}

export interface TransformField {
	path: string[]
	isArray: boolean
	containerPath: string[] // Path to the array/object containing this field
	transformType: 'date'
}
