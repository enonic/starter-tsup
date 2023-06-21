import type {
	Request,
	Response,
} from '/index.d';


import {toStr} from '@enonic/js-utils';
// @ts-expect-error TS2307: Cannot find module '/lib/enonic/static' or its corresponding type declarations.
import {buildGetter} from '/lib/enonic/static';
import { GETTER_ROOT, DEBUG_MODE } from '/constants';


const etagGetter = buildGetter({
	cacheControl: 'no-cache', // implies must-revalidate after 0 seconds
	etag: true, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		DEBUG_MODE && log.info('request:%s', toStr(request));
		DEBUG_MODE && log.info('contextPath:%s', request.contextPath);
		DEBUG_MODE && log.info('rawPath:%s', request.rawPath);

		const prefix = request.contextPath;
		let cleanPath = prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
		cleanPath = cleanPath.replace(`${GETTER_ROOT}/`, '');

		DEBUG_MODE && log.info('cleanPath:%s', cleanPath);

		return cleanPath;
	},
	root: GETTER_ROOT
}) as (_request: Request) => Response;


export default etagGetter;
