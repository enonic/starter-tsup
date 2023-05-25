import type {
	ContentSecurityPolicy,
	Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import { render } from '/lib/mustache';
// @ts-ignore
import Router from '/lib/router';
import {
	getLauncherPath,
	getLauncherUrl,
} from '/lib/xp/admin';
import { assetUrl } from '/lib/xp/portal';
import contentSecurityPolicy from '/lib/contentSecurityPolicy';
import getImmuteableAdminUrl from './getImmuteableAdminUrl';
import immutableGetter from './immutableGetter';
import {
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';


const VIEW = resolve('exampleTool.html');


const router = Router();


router.all(`/${GETTER_ROOT}/{path:.+}`, (r: Request) => {
	// log.info('Request:%s', toStr(r));
	return immutableGetter(r);
});


function get(
	request: Request
): Response {
	// log.info('request:%s', toStr(request));

	const csp: ContentSecurityPolicy = {
		'default-src': 'none',
		'connect-src': 'self',
		'font-src': 'self',
		'img-src': 'self',
		'script-src': [
			'self',
			'unsafe-inline'
		],
		'style-src': [
			'self',
			'unsafe-inline'
		],
	};

	var params = {
		applicationIconUrl: getImmuteableAdminUrl({ path: 'icons/application.svg' }),
		appUrl: getImmuteableAdminUrl({ path: 'admin/App.mjs' }),
		cssUrl: getImmuteableAdminUrl({ path: 'admin/App.css' }),
		assetsUrl: assetUrl({ path: '' }),
		launcherPath: getLauncherPath(),
		launcherUrl: getLauncherUrl(),
		reactDomUrl: getImmuteableAdminUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react-dom/umd/react-dom.development.js'
		}),
		reactUrl: getImmuteableAdminUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react/umd/react.development.js',
		}),
	};

	return {
		body: render(VIEW, params),
		headers: {
			'content-security-policy': contentSecurityPolicy(csp)
		}
	};
};

router.get('', (r: Request) => get(r)); // Default admin tool path
router.get('/', (r: Request) => get(r)); // Just in case someone adds a slash on the end

export const all = (r: Request) => router.dispatch(r);
