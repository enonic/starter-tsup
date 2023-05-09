import jsonParseResource from '/lib/jsonParseResource';
import {
	getSite,
	pageUrl as getPageUrl,
} from '/lib/xp/portal';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	GETTER_ROOT,
} from '/constants';


let statics = jsonParseResource(FILEPATH_MANIFEST);


export default function getImmuteableSiteUrl(path: string) {
	if (IS_DEV_MODE) {
		statics = jsonParseResource(FILEPATH_MANIFEST);
	}

	const sitePath = getSite()._path;
	// log.info('sitePath:%s', sitePath);

	let sitePageUrl = getPageUrl({
		path: sitePath
	});
	if (sitePageUrl === '/') {
		sitePageUrl = '';
	}
	return `${sitePageUrl}/${GETTER_ROOT}/${statics[path]}`;
}
