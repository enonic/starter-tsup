import type {
	Request,
	Response,
} from '/index.d';

import {toStr} from '@enonic/js-utils';
import {DEBUG_MODE} from "/constants";

interface Error {
	message: string
	request: Request
	status: number
}

export function handle404(error: Error): Response {
	let response: Response = {
		status: 404
	};
	try {
		DEBUG_MODE && log.debug('error:%s', toStr(error));
		const {
			message,
			request,
			status,
		} = error;
		log.warning('status:404 message:%s request:%s', message, toStr(request));
		response = {
			body: `<html>
		<head>
			<title>404</title>
		</head>
		<body>
			<p>Not found</p>
		</body>
	</html>`,
			contentType: 'text/html',
			status
		}
	} catch (exception) {
		log.error(`exception:${toStr(exception)}`, exception); // Logs stacktrace
	} finally {
		return response;
	}
}


export function handleError(error: Error): Response {
	const response: Response = {
		status: 500
	};
	try {
		DEBUG_MODE && log.debug('error:%s', toStr(error));
		const {
			message,
			request,
			status
		} = error;
		log.error('status:%s message:%s request:%s', status, message, toStr(request));
		response.status = status;
		response.body = `<html>
		<head>
			<title>${status}</title>
		</head>
		<body>
			<p>Something went wrong</p>
		</body>
	</html>`;
		response.contentType = 'text/html';
	} catch (exception) {
		log.error(`exception:${toStr(exception)}`, exception); // Logs stacktrace
	} finally {
		return response;
	}
}
