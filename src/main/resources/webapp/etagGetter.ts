// import type {Request} from '@enonic/js-utils/types/Request';
// import type {Response} from '@enonic/js-utils/types/Response';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import {buildGetter} from '/lib/enonic/static';

const root = 'static';

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
		cleanPath = cleanPath.replace(`${root}/`, '');
		// log.info('cleanPath:%s', cleanPath);
		return cleanPath;
	},
	root: root
}) as (request: Request) => Response;


export default etagGetter;
