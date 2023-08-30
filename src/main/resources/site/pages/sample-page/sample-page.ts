import type {
	ContentSecurityPolicy,
	Request,
	Response,
} from '/index.d';

//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	getSupportedLocales,
	localize,
} from '/lib/xp/i18n';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent,
	serviceUrl as getServiceUrl,
} from '/lib/xp/portal';
import {
	base64Encode,
	sha256AsStream,
	// @ts-ignore
} from '/lib/text-encoding';
import { getSiteUrl } from '/lib/urlHelper';
import contentSecurityPolicy from '/lib/contentSecurityPolicy';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	DEBUG_MODE,
	FILEPATH_MANIFEST_CJS,
	FILEPATH_MANIFEST_NODE_MODULES
} from '/constants';


const VIEW = resolve('./sample-page.html');


export function get(r: Request): Response {
	DEBUG_MODE && log.info('Hello from the page template controller!');

	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();

	const currentTimeMillisServiceUrl = getServiceUrl({
		service: 'currentTimeMillis'
	});

	const inlineScript = `import {App} from '${getSiteUrl({
		path: 'react/App.mjs'
	})}';

const response = await fetch("${currentTimeMillisServiceUrl}");
const jsonData = await response.json();

const root = ReactDOM.createRoot(document.getElementById('react-root'));
const dateTime = new Date(jsonData.currentTimeMillis);
root.render(React.createElement(App, { header: "Hello from React inside a site page!", message: "Current server-side date/time is: " + dateTime }));
`;

	const base64 = base64Encode(sha256AsStream(inlineScript));
	DEBUG_MODE && log.info('inlineScript in base64:%s', base64);

	const csp: ContentSecurityPolicy = {
		'default-src': 'none',
		'connect-src': 'self',
		'img-src': 'self',
		'script-src': [
			'self',
			IS_DEV_MODE
				? 'unsafe-inline' // browserSync
				: `sha256-${base64}`
		],
		'style-src': [
			'self',
			'unsafe-inline'
		],
	};

	const model = {
		assetUrl: getAssetUrl({ path: '' }),
		displayName,
		inlineScript,
		languageInNorwegian: localize({
			key: 'language',
			locale: 'no',
		}),
		reactUrl: getSiteUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react/umd/react.development.js',
		}),
		reactDomUrl: getSiteUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react-dom/umd/react-dom.development.js'
		}),
		reactCssUrl: getSiteUrl({
			manifestPath: FILEPATH_MANIFEST_CJS,
			path: 'react/App.css'
		}),
		regions,
		supportedLocales: getSupportedLocales(['i18n/phrases']),
		liveMode: r.mode !== 'edit'
	};

	return {
		body: render(VIEW, model),
		// This header should only be sent if you want to soften the default browser policy!
		headers: {
			'content-security-policy': contentSecurityPolicy(csp)
		}
	}
}
