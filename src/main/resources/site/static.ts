import type {
	Request,
	Response,
} from '/index.d';


// @ts-expect-error TS2307: Cannot find module '/lib/enonic/static' or its corresponding type declarations.
import {buildGetter} from '/lib/enonic/static';
import { GETTER_ROOT } from '/constants';
import {DEBUG_MODE} from "/constants";


const staticGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		let rawPathParts = request.rawPath.split('/');
		if (rawPathParts[1] === 'admin') {
			rawPathParts = rawPathParts.slice(7)
		} else if (rawPathParts[1] === 'site') {
			rawPathParts = rawPathParts.slice(5)
		} else {
			throw new Error(`Invalid rawPath: ${request.rawPath}`);
		}

		const r = rawPathParts.shift(); // Remove ROOT
		if (r !== GETTER_ROOT) {
			throw new Error(`Path outside root! ${request.rawPath}`);
		}

		return `/${rawPathParts.join('/')}`;
	},
	root: GETTER_ROOT,
}) as (_request: Request) => Response;


export const get = (request: Request) => staticGetter(request);
