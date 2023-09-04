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
	getBrowserSyncUrl,
	isRunning
} from '/lib/browserSync';
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

	const csp = CSP_DEFAULT;
	(csp['script-src'] as string[]).push(UNSAFE_INLINE);
	(csp['style-src'] as string[]).push(UNSAFE_INLINE);

	let browserSyncUrl = '';
	if (IS_DEV_MODE) {
		if (isRunning({ request })) {
			browserSyncUrl = getBrowserSyncUrl({ request });
		} else {
			log.info('TIP: You are running Enonic XP in development mode, however, BrowserSync is not running. You can run `npm run watch` in a separate terminal to enable watch mode :)');
		}
	}

	const params = {
		applicationIconUrl: getAdminUrl({
			path: 'icons/application.svg'
		}, toolName),
		appUrl: getAdminUrl({
			path: 'admin/App.mjs'
		}, toolName),
		browserSyncUrl,
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
