import type { Request } from '/index.d';


import { toStr } from '@enonic/js-utils/value/toStr';
// @ts-expect-error TS2307: Cannot find module '/lib/cache' or its corresponding type declarations.
import { newCache } from '/lib/cache';
// @ts-expect-error TS2307: Cannot find module '/lib/http-client' or its corresponding type declarations.
import { request as httpClientRequest } from '/lib/http-client';


const A_SECOND = 1000;

const isRunningCache = newCache({
	size: 1,
	expire: 10 * A_SECOND
});


export function getBrowserSyncUrl({request}: {request: Request}): string {
	const {
		host,
		scheme
	} = request;
	return `${scheme}://${host}:${
		// @ts-expect-error Is replaced at build time by tsup:
		process.env.BROWSER_SYNC_PORT
	}/browser-sync/browser-sync-client.js`;
}


export function isRunning({request}: {request: Request}): boolean {
	return isRunningCache.get('hardcoded-cache-key', () => {
		try {
			const requestParameters = {
				url: getBrowserSyncUrl({request}),
				method: 'HEAD',
				// headers: {
				// 	'Cache-Control': 'no-cache'
				// },
				connectionTimeout: 1000,
				readTimeout: 1000
			};
			const response = httpClientRequest(requestParameters);
			if (response.status !== 200) {
				log.info('Response status not 200 when checking for BrowserSync request:%s response:%s', toStr(requestParameters), toStr(response));
				return false;
			}
			return true
		} catch (e) {
			return false;
		}
	});
}


export function getBrowserSyncScript({request}: {request: Request}): string {
	return `<script src="${getBrowserSyncUrl({request})}"></script>`;
}
