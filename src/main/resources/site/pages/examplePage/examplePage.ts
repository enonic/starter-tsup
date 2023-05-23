import type {
	ContentSecurityPolicy,
	// Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
import shajs from 'sha.js'
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
import getImmuteableSiteUrl from '/lib/getImmuteableSiteUrl';
import contentSecurityPolicy from '/lib/contentSecurityPolicy';


const VIEW = resolve('./examplePage.html');


export function get(/*request: Request*/): Response {
	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();

	const currentTimeMillisServiceUrl = getServiceUrl({
		service: 'currentTimeMillis'
	});

	const inlineScript = `import {App} from '${getImmuteableSiteUrl('react/App.mjs')}';
const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(React.createElement(App, {}));

const response = await fetch("${currentTimeMillisServiceUrl}");
const jsonData = await response.json();
console.log(jsonData);
`
	// log.info('inlineScript:%s', inlineScript);

	const base64 = shajs('sha256').update(inlineScript).digest('base64');
	// log.info('base64:%s', base64);

	const csp: ContentSecurityPolicy = {
		'default-src': 'none',
		'connect-src': 'self',
		'img-src': 'self',
		'script-src': [
			'self',
			`sha256-${base64}`
		],
		'style-src': [
			'self',
			'unsafe-inline'
		],
	};

	const model = {
		assetUrl: getAssetUrl({ path: '' }),
		cssUrl: getImmuteableSiteUrl('react/App.css'),
		displayName,
		inlineScript,
		languageInNorwegian: localize({
			key: 'language',
			locale: 'no',
		}),
		reactUrl: getImmuteableSiteUrl('react/react.development.js'),
		reactDomUrl: getImmuteableSiteUrl('react/react-dom.development.js') ,
		regions,
		supportedLocales: getSupportedLocales(['i18n/phrases'])
	};
	return {
		body: render(VIEW, model),
		headers: {
			'content-security-policy': contentSecurityPolicy(csp)
		}
	}
}
