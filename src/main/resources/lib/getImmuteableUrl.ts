import ioResource from '/lib/ioResource';
import {
	getSite,
	pageUrl as getPageUrl,
} from '/lib/xp/portal';
import { getToolUrl } from '/lib/xp/admin';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';

const manifests = {
	[FILEPATH_MANIFEST]: ioResource(FILEPATH_MANIFEST),
	[FILEPATH_MANIFEST_NODE_MODULES]: ioResource(FILEPATH_MANIFEST_NODE_MODULES),
}

type UrlPostfixParams = {
	manifestPath?: string
	path: string,
};

type UrlParams = {urlPrefix: string} & UrlPostfixParams;

function getImmuteableUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
	urlPrefix,
}: UrlParams) {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = ioResource(manifestPath);
	}

	return `${urlPrefix}/${GETTER_ROOT}/${manifests[manifestPath][path]}`;
}

export function getSiteUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: UrlPostfixParams) {
	const sitePath = getSite()._path;
	let urlPrefix = getPageUrl({
		path: sitePath
	});
	if (urlPrefix === '/') {
		urlPrefix = '';
	}

	return getImmuteableUrl({
		urlPrefix,
		manifestPath,
		path,
	});
}

export function getAdminUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: UrlPostfixParams, tool: string) {
	// log.debug('getAdminUrl path:%s', path);
	const urlPrefix = getToolUrl(app.name, tool);

	return getImmuteableUrl({
		urlPrefix,
		manifestPath,
		path,
	});
}
