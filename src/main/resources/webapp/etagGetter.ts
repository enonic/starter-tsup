import type {
	Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import {buildGetter} from '/lib/enonic/static';

const ROOT = 'static';

const etagGetter = buildGetter({
	cacheControl: 'no-cache', // implies must-revalidate after 0 seconds
	etag: true, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		// log.info('request:%s', toStr(request));
		// log.info('contextPath:%s', request.contextPath);
		// log.info('rawPath:%s', request.rawPath);
		const prefix = request.contextPath;
		let cleanPath = prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
		// log.info('cleanPath:%s', cleanPath);
		cleanPath = cleanPath.replace(`${ROOT}/`, '');
		// log.info('cleanPath:%s', cleanPath);
		return cleanPath;
	},
	root: ROOT
}) as (request: Request) => Response;


export default etagGetter;
