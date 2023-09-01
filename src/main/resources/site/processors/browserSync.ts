import type {
	Request,
	Response,
} from '/index.d';


// import { toStr } from '@enonic/js-utils/value/toStr';
import lcKeys from '@enonic/js-utils/object/lcKeys';
import { IS_PROD_MODE } from '/lib/runMode';


export function responseProcessor(req: Request, res: Response) {
	// log.info('req:%s', toStr(req));
	// log.info('res:%s', toStr(res));

	const {
		mode,
	} = req;

	if (IS_PROD_MODE || mode === 'inline' || mode === 'edit') {
		return res;
	}

	const {
		host,
		scheme
	} = req;

	const lcHeaders = lcKeys(res.headers || {});
	lcHeaders['content-security-policy'] = `default-src * 'unsafe-eval' 'unsafe-inline' data: filesystem: about: blob: ws: wss:`;
	res.headers = lcHeaders;

	const contribution = `<script src="${scheme}://${host}:${
		// @ts-expect-error Is replaced at build time by tsup:
		process.env.BROWSER_SYNC_PORT
	}/browser-sync/browser-sync-client.js"></script>`

	if (!res.pageContributions.bodyEnd) {
		res.pageContributions.bodyEnd = [contribution];
	} else if (Array.isArray(res.pageContributions.bodyEnd)) {
		res.pageContributions.bodyEnd.push(contribution);
	} else {
		res.pageContributions.bodyEnd = [res.pageContributions.bodyEnd, contribution];
	}

	return res;
}
