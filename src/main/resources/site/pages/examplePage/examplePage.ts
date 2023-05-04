import {toStr} from '@enonic/js-utils';
import jsonParseResource from '/lib/jsonParseResource';
//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent,
	url as getUrl
} from '/lib/xp/portal';
import {
	isEnabled as vhostsEnabled,
	list as getVhosts
} from '/lib/xp/vhost';


const VIEW = resolve('./examplePage.html');

const assets = jsonParseResource('/assets/manifest.json');
//log.info('assets:%s', toStr(assets));


export function get(request) {
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
		appComponentUrl: assets['assets/script/index.mjs'].replace('assets/',''),
		cssUrl: assets['assets/script/index.css'].replace('assets',''),
		assetUrl: getAssetUrl({
			path: ''
		}),
		staticUrl: vhostsEnabled() && webappVhost ? webappVhost.source : getUrl({
			path: `/webapp/${app.name}/static`
		}),
		displayName,
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
