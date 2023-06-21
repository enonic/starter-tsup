import jsonParseResource from '/lib/jsonParseResource';
import {
	getSite,
	pageUrl as getPageUrl,
} from '/lib/xp/portal';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';

const manifests = {
	[FILEPATH_MANIFEST]: jsonParseResource(FILEPATH_MANIFEST),
	[FILEPATH_MANIFEST_NODE_MODULES]: jsonParseResource(FILEPATH_MANIFEST_NODE_MODULES),
}

export default function getImmuteableSiteUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: {
	manifestPath?: string
	path: string,
}) {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = jsonParseResource(manifestPath);
	}

	const sitePath = getSite()._path;

	let sitePageUrl = getPageUrl({
		path: sitePath
	});
	if (sitePageUrl === '/') {
		sitePageUrl = '';
	}
	return `${sitePageUrl}/${GETTER_ROOT}/${manifests[manifestPath][path]}`;
}
