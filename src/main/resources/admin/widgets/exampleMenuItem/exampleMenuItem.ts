import type {
	// Request,
	Response,
} from '/index.d';


import {toStr} from '@enonic/js-utils';


export function get(
	// request: Request
): Response {
	// log.info('request:%s', toStr(request));
	return {
		body: '<widget>My menuitem widget</widget>',
		contentType: 'text/html'
	};
}
