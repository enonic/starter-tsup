import type {
	Request,
	Response,
} from '/index.d';


// @ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
}


export function get(request: Request): Response {
	return {
		body: JSON.stringify({
			currentTimeMillis: currentTimeMillis()
		}),
		contentType: 'application/json'
	}
}


export const post = get;
