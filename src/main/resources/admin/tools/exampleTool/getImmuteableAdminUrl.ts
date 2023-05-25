import jsonParseResource from '/lib/jsonParseResource';
import { IS_DEV_MODE } from '/lib/runMode';
import { getToolUrl } from '/lib/xp/admin';
import {
	FILEPATH_MANIFEST,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';


const manifests = {
	[FILEPATH_MANIFEST]: jsonParseResource(FILEPATH_MANIFEST),
	[FILEPATH_MANIFEST_NODE_MODULES]: jsonParseResource(FILEPATH_MANIFEST_NODE_MODULES),
}


export default function getImmuteableAdminUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: {
	manifestPath?: string
	path: string,
}) {
	// log.debug('getImmuteableAdminUrl path:%s', path);
	if (IS_DEV_MODE) {
		manifests[manifestPath] = jsonParseResource(manifestPath);
	}
	return `${getToolUrl(app.name, 'exampletool')}/${GETTER_ROOT}/${manifests[manifestPath][path]}`;
}
