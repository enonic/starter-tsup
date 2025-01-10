import type {
	Request,
	Response,
} from '/index.d';


// @ts-expect-error no-types
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
}


export function get(): Response {
	return {
		body: JSON.stringify({
			currentTimeMillis: currentTimeMillis()
		}),
		contentType: 'application/json'
	}
}


export const post = get;
