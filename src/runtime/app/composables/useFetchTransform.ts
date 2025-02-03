import type { TransformRoutes, TransformRouteMethods } from '#fetch-transforms'

import { transforms } from '#fetch-transforms'

export function useFetchTransform<
	ReqT extends TransformRoutes,
	Method extends TransformRouteMethods<ReqT> = 'get' extends TransformRouteMethods<ReqT>
		? 'get'
		: TransformRouteMethods<ReqT>,
>(path: ReqT, method: Method) {
	const transform = transforms[path][method]

	return transform
}
