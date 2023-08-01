import type {
	Request,
	Response,
} from '/index.d';

// @ts-ignore
import {buildGetter} from '/lib/enonic/static';
import { GETTER_ROOT } from '/constants';

export const immutableGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		const prefix = request.contextPath;
		let cleanPath = prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
		cleanPath = cleanPath.replace(`${GETTER_ROOT}/`, '');
		return cleanPath;
	},
	root: GETTER_ROOT
}) as (request: Request) => Response;

export default immutableGetter;
