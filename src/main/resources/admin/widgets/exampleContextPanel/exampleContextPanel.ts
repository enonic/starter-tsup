import type {
	Request,
	Response,
} from '/index.d';

import {DEBUG_MODE} from "/constants";
import {toStr} from '@enonic/js-utils';

export function get(
	request: Request
): Response {
	DEBUG_MODE && log.info('request:%s', toStr(request));
	return {
		body: '<widget>My context widget</widget>',
		contentType: 'text/html'
	};
}
