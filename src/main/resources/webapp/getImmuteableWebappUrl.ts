import jsonParseResource from '/lib/jsonParseResource';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';
import webappUrl from '/webapp/webappUrl';


const manifests = {
	[FILEPATH_MANIFEST]: jsonParseResource(FILEPATH_MANIFEST),
	[FILEPATH_MANIFEST_NODE_MODULES]: jsonParseResource(FILEPATH_MANIFEST_NODE_MODULES),
}


export default function getImmuteableWebappUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: {
	manifestPath?: string
	path: string,
}) {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = jsonParseResource(manifestPath);
	}
	return webappUrl(`${GETTER_ROOT}/${manifests[manifestPath][path]}`);
}
