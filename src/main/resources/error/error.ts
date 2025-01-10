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
	if (DEBUG_MODE) {
		log.info('Hello from the 404 error handler!');
	}
	let response: Response = {
		status: 404
	};
	try {
		const {
			message,
			status,
		} = error;
		response = {
			body: `<html>
		<head>
			<title>404</title>
		</head>
		<body>
			<p>Custom 404 handler: ${toStr(message)}</p>
		</body>
	</html>`,
			contentType: 'text/html',
			status
		}
	} catch (exception) {
		log.error(`Exception: ${toStr(exception)}`, exception); // Logs stacktrace
	} finally {
		return response;
	}
}


export function handleError(error: Error): Response {
	if (DEBUG_MODE) {
		log.info('Hello from the default error handler!');
	}

	const response: Response = {
		status: 500
	};
	try {
		const {
			message,
			status
		} = error;
		response.status = status;
		response.body = `<html>
		<head>
			<title>${status}</title>
		</head>
		<body>
			<p>Custom error handler: ${toStr(message)}</p>
		</body>
	</html>`;
		response.contentType = 'text/html';
	} catch (exception) {
		log.error(`exception:${toStr(exception)}`, exception); // Logs stacktrace
	} finally {
		return response;
	}
}
