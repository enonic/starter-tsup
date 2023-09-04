import type { Request } from '/index.d';


import { IS_PROD_MODE } from '/lib/runMode';


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


export function getBrowserSyncScript({request}: {request: Request}): string {
	if (IS_PROD_MODE) {
		return '';
	}
	return `<script src="${getBrowserSyncUrl({request})}"></script>`;
}
