import type {
	// Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
import jsonParseResource from '/lib/jsonParseResource';
//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent,
} from '/lib/xp/portal';
import getImmuteableSiteUrl from '/lib/getImmuteableSiteUrl';
import webappUrl from '/webapp/webappUrl';


const VIEW = resolve('./examplePage.html');

const reacts = jsonParseResource('/static/react/manifest.json');
// log.info('reacts:%s', toStr(reacts));


export function get(/*request: Request*/): Response {
	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();
	const model = {
		appComponentUrl: getImmuteableSiteUrl('react/App.mjs'),
		assetUrl: getAssetUrl({ path: '' }),
		cssUrl: getImmuteableSiteUrl('react/App.css'),
		displayName,
		reactUrl: webappUrl(`static/${reacts['react/react.development.js']}`),
		reactDomUrl: webappUrl(`static/${reacts['react/react-dom.development.js']}`) ,
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
