import type {
	// Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
import shajs from 'sha.js'
//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent,
} from '/lib/xp/portal';
import getImmuteableSiteUrl from '/lib/getImmuteableSiteUrl';


const VIEW = resolve('./examplePage.html');



export function get(/*request: Request*/): Response {
	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();

	const inlineScript = `import {App} from '${getImmuteableSiteUrl('react/App.mjs')}';
	const root = ReactDOM.createRoot(document.getElementById('react-root'));
	root.render(React.createElement(App, {}));`
	// log.info('inlineScript:%s', inlineScript);

	const base64 = shajs('sha256').update(inlineScript).digest('base64');
	// log.info('base64:%s', base64);

	const model = {
		assetUrl: getAssetUrl({ path: '' }),
		cssUrl: getImmuteableSiteUrl('react/App.css'),
		displayName,
		inlineScript,
		reactUrl: getImmuteableSiteUrl('react/react.development.js'),
		reactDomUrl: getImmuteableSiteUrl('react/react-dom.development.js') ,
		regions
	};
	return {
		body: render(VIEW, model),
		headers: {
			'content-security-policy': `default-src 'none'; img-src 'self'; script-src 'self' 'sha256-${base64}'; style-src 'self' 'unsafe-inline';`
		}
	}
}
