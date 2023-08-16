import type {
	ContentSecurityPolicy,
	Request,
	Response,
} from '/index.d';

import {toStr} from '@enonic/js-utils';
// @ts-ignore
import { render } from '/lib/mustache';
// @ts-ignore
import Router from '/lib/router';
import {
	getLauncherPath
} from '/lib/xp/admin';
import { assetUrl } from '/lib/xp/portal';
import contentSecurityPolicy from '/lib/contentSecurityPolicy';
import { getAdminUrl } from '/lib/getImmuteableUrl';
import immutableGetter from './immutableGetter';
import {
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';

const toolName = 'tool';
const VIEW = resolve(`${toolName}.html`);
const router = Router();

router.all(`/${GETTER_ROOT}/{path:.+}`, (r: Request) => {
	return immutableGetter(r);
});

function get(r: Request): Response {

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

	const params = {
		applicationIconUrl: getAdminUrl({ path: 'icons/application.svg' }, toolName),
		appUrl: getAdminUrl({ path: 'admin/App.mjs' }, toolName),
		cssUrl: getAdminUrl({ path: 'admin/App.css' }, toolName),
		assetsUrl: assetUrl({ path: '' }),
		launcherPath: getLauncherPath(),
		reactDomUrl: getAdminUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react-dom/umd/react-dom.development.js'
		}, toolName),
		reactUrl: getAdminUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react/umd/react.development.js',
		}, toolName),
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
