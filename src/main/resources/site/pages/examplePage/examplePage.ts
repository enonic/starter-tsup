// import {toStr} from '@enonic/js-utils';
import jsonParseResource from '/lib/jsonParseResource';
//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent,
	getSite,
	pageUrl as getPageUrl,
	url as getUrl
} from '/lib/xp/portal';
import {
	isEnabled as vhostsEnabled,
	list as getVhosts
} from '/lib/xp/vhost';


const VIEW = resolve('./examplePage.html');

const statics = jsonParseResource('/static/manifest.json');
//log.info('statics:%s', toStr(statics));


export function get(request) {
	const sitePath = getSite()._path;
	// log.info('sitePath:%s', sitePath);

	let sitePageUrl = getPageUrl({
		path: sitePath
	});
	if (sitePageUrl === '/') {
		sitePageUrl = '';
	}
	// log.info('sitePageUrl:%s', sitePageUrl);

	const {vhosts} = getVhosts();
	// log.info('vhosts:%s', toStr(vhosts));

	const webappVhost = vhosts.filter(({target}) => target.startsWith('/webapp'))[0];
	// log.info('webappVhost:%s', toStr(webappVhost));

	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();
	const model = {
		appComponentUrl: `${sitePageUrl}/static/${statics['react/App.mjs']}` ,
		cssUrl: `${sitePageUrl}/static/${statics['react/App.css']}`,
		assetUrl: getAssetUrl({
			path: ''
		}),
		webappUrl: vhostsEnabled() && webappVhost
			? webappVhost.source
			: `/webapp/${app.name}`,
		displayName,
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
