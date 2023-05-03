// import type {Request} from '@enonic/js-utils/types/Request';
// import type {Response} from '@enonic/js-utils/types/Response';


// @ts-ignore
import {buildGetter} from '/lib/enonic/static';


export const immutableGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		const prefix = request.contextPath;
		return prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
	},
	root: 'webapp'
}) as (request: Request) => Response;


export default immutableGetter;
