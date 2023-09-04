import type {
	Request,
	Response,
} from '/index.d';


// import { toStr } from '@enonic/js-utils/value/toStr';
import lcKeys from '@enonic/js-utils/object/lcKeys';
import {
	getBrowserSyncScript,
	isRunning
} from '/lib/browserSync';
import { IS_PROD_MODE } from '/lib/runMode';
import {
	CSP_PERMISSIVE,
	contentSecurityPolicy
} from '/lib/contentSecurityPolicy';


export function responseProcessor(request: Request, res: Response) {
	// log.info('req:%s', toStr(req));
	// log.info('res:%s', toStr(res));

	const {
		mode,
	} = request;

	if (IS_PROD_MODE || mode === 'inline' || mode === 'edit') {
		return res;
	}

	if (!isRunning({ request })) {
		log.info('TIP: You are running Enonic XP in development mode, however, BrowserSync is not running. You can run `npm run watch` in a separate terminal to enable watch mode :)');
		return res;
	}

	const lcHeaders = lcKeys(res.headers || {});
	lcHeaders['content-security-policy'] = contentSecurityPolicy(CSP_PERMISSIVE);
	res.headers = lcHeaders;

	const contribution = getBrowserSyncScript({ request });

	if (!res.pageContributions.bodyEnd) {
		res.pageContributions.bodyEnd = [contribution];
	} else if (Array.isArray(res.pageContributions.bodyEnd)) {
		res.pageContributions.bodyEnd.push(contribution);
	} else {
		res.pageContributions.bodyEnd = [res.pageContributions.bodyEnd, contribution];
	}

	return res;
}
