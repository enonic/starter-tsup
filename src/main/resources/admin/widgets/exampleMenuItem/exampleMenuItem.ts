import type {
	Request,
	Response,
} from '/index.d';

import {toStr} from '@enonic/js-utils';
import {DEBUG_MODE} from "/constants";

export function get(
	request: Request
): Response {
	DEBUG_MODE && log.info('request:%s', toStr(request));
	return {
		body: '<widget style="margin-left: 50px;">My menu widget</widget>',
		contentType: 'text/html'
	};
}
