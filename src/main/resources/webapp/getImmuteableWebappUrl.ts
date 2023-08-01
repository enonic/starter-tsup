import ioResource from '/lib/ioResource';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '/constants';
import webappUrl from '/webapp/webappUrl';


const manifests = {
	[FILEPATH_MANIFEST]: ioResource(FILEPATH_MANIFEST),
	[FILEPATH_MANIFEST_NODE_MODULES]: ioResource(FILEPATH_MANIFEST_NODE_MODULES),
}


export default function getImmuteableWebappUrl({
	manifestPath = FILEPATH_MANIFEST,
	path,
}: {
	manifestPath?: string
	path: string,
}) {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = ioResource(manifestPath);
	}
	return webappUrl(`${GETTER_ROOT}/${manifests[manifestPath][path]}`);
}
