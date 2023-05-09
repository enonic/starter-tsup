import jsonParseResource from '/lib/jsonParseResource';
import {IS_DEV_MODE} from '/lib/runMode';
import {
	FILEPATH_MANIFEST,
	GETTER_ROOT,
} from '/constants';
import webappUrl from '/webapp/webappUrl';


let statics = jsonParseResource(FILEPATH_MANIFEST);


export default function getImmuteableWebappUrl(path: string) {
	if (IS_DEV_MODE) {
		statics = jsonParseResource(FILEPATH_MANIFEST);
	}
	return webappUrl(`${GETTER_ROOT}/${statics[path]}`);
}
