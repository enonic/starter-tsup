import type {
	Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import {buildGetter} from '/lib/enonic/static';
import { GETTER_ROOT } from '/constants';



export const immutableGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		// log.info('request:%s', toStr(request));
		// log.info('contextPath:%s', request.contextPath);
		// log.info('rawPath:%s', request.rawPath);
		const prefix = request.contextPath;
		let cleanPath = prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
		// log.info('cleanPath:%s', cleanPath);
		cleanPath = cleanPath.replace(`${GETTER_ROOT}/`, '');
		// log.info('cleanPath:%s', cleanPath);
		return cleanPath;
	},
	root: GETTER_ROOT
}) as (request: Request) => Response;


export default immutableGetter;