// import type {Request} from '@enonic/js-utils/types/Request';
// import type {Response} from '@enonic/js-utils/types/Response';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import {buildGetter} from '/lib/enonic/static';


const etagGetter = buildGetter({
	cacheControl: 'no-cache', // implies must-revalidate after 0 seconds
	etag: true, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		// log.info('request:%s', toStr(request));
		// log.debug('rawPath:%s', request.rawPath);
		const prefix = request.contextPath;
		return prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
	},
	root: 'webapp'
}) as (request: Request) => Response;


export default etagGetter;
