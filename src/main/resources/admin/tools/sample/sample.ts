import type {
	Request,
	Response,
} from '/index.d';

// @ts-ignore
import { render } from '/lib/mustache';
// @ts-ignore
import Router from '/lib/router';
import {
	getLauncherPath
} from '/lib/xp/admin';
import { assetUrl } from '/lib/xp/portal';
import {
	CSP_DEFAULT,
	CSP_PERMISSIVE,
	UNSAFE_INLINE,
	contentSecurityPolicy,
} from '/lib/contentSecurityPolicy';
import { IS_DEV_MODE } from '/lib/runMode';
import { immutableGetter, getAdminUrl } from '/lib/urlHelper';
import {
	FILEPATH_MANIFEST_CJS,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';

const router = Router();

router.all(`/${GETTER_ROOT}/{path:.+}`, (r: Request) => {
	return immutableGetter(r);
});

const get = (request: Request): Response => {
	const toolName = 'sample';
	const VIEW = resolve(`${toolName}.html`);

	const {
		host,
		scheme
	} = request;

	const csp = CSP_DEFAULT;
	(csp['script-src'] as string[]).push(UNSAFE_INLINE);
	(csp['style-src'] as string[]).push(UNSAFE_INLINE);

	const params = {
		applicationIconUrl: getAdminUrl({
			path: 'icons/application.svg'
		}, toolName),
		appUrl: getAdminUrl({
			path: 'admin/App.mjs'
		}, toolName),
		browserSyncUrl: `${scheme}://${host}:${
			// @ts-expect-error Is replaced at build time by tsup:
			process.env.BROWSER_SYNC_PORT
		}/browser-sync/browser-sync-client.js`,
		cssUrl: getAdminUrl({
			manifestPath: FILEPATH_MANIFEST_CJS,
			path: 'admin/App.css'
		}, toolName),
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
		xpRunDevMode: IS_DEV_MODE
	};

	return {
		body: render(VIEW, params),
		headers: {
			'content-security-policy': contentSecurityPolicy(IS_DEV_MODE ? CSP_PERMISSIVE : csp)
		}
	};
};

router.get('', (r: Request) => get(r)); // Default admin tool path
router.get('/', (r: Request) => get(r)); // Just in case someone adds a slash on the end

export const all = (r: Request) => router.dispatch(r);