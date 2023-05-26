import type {
	Request,
	Response,
} from '/index.d';


import {toStr} from '@enonic/js-utils';
// @ts-expect-error TS2307: Cannot find module '/lib/enonic/static' or its corresponding type declarations.
import {buildGetter} from '/lib/enonic/static';
import { GETTER_ROOT } from '/constants';


const staticGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		// log.debug('request:%s', toStr(request));
		// log.debug('contextPath:%s', request.contextPath);
		log.debug('rawPath:%s', request.rawPath);
		let rawPathParts = request.rawPath.split('/');
		if (rawPathParts[1] === 'admin') {
			rawPathParts = rawPathParts.slice(7)
		} else if (rawPathParts[1] === 'site') {
			rawPathParts = rawPathParts.slice(5)
		} else {
			throw new Error(`Invalid rawPath:${request.rawPath}`);
		}
		log.debug('rawPathParts:%s', toStr(rawPathParts));

		const r = rawPathParts.shift(); // Remove ROOT
		if (r !== GETTER_ROOT) {
			throw new Error(`Path outsite root! ${request.rawPath}`);
		}

		const cleanPath = `/${rawPathParts.join('/')}`;
		log.debug('cleanPath:%s', cleanPath);

		return cleanPath;
	},
	root: GETTER_ROOT,
}) as (_request: Request) => Response;


export const get = (request: Request) => staticGetter(request);
