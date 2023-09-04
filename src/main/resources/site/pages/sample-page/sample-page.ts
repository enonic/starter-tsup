import type {
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
import {
	CSP_DEFAULT,
	CSP_PERMISSIVE,
	UNSAFE_INLINE,
	contentSecurityPolicy,
	pushUniq,
	sha256
} from '/lib/contentSecurityPolicy';
import { IS_PROD_MODE } from '/lib/runMode';
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
		emptyRegion: regions.main.components.length === 0,
		supportedLocales: getSupportedLocales(['i18n/phrases']),
		liveMode: r.mode !== 'edit'
	};

	const response: Response = {
		body: render(VIEW, model)
	};

	if (IS_PROD_MODE) {
		const base64 = base64Encode(sha256AsStream(inlineScript));
		DEBUG_MODE && log.info('inlineScript in base64:%s', base64);

		const csp = CSP_DEFAULT;
		pushUniq(csp['script-src'], sha256(base64));
		pushUniq(csp['style-src'], UNSAFE_INLINE);

		// This header should only be sent if you want to soften the default browser policy!
		response.headers = {'content-security-policy': contentSecurityPolicy(csp)};
	} else {
		// Everything allowed in when running Enonic XP in development mode:
		response.headers = {'content-security-policy': contentSecurityPolicy(CSP_PERMISSIVE)};
	}

	return response;
}
