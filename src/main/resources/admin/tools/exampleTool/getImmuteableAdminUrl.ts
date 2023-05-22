import jsonParseResource from '/lib/jsonParseResource';
import { IS_DEV_MODE } from '/lib/runMode';
import { getToolUrl } from '/lib/xp/admin';
import {
	FILEPATH_MANIFEST,
	GETTER_ROOT,
} from '/constants';


let statics = jsonParseResource(FILEPATH_MANIFEST);


export default function getImmuteableAdminUrl(path: string) {
	// log.debug('getImmuteableAdminUrl path:%s', path);
	if (IS_DEV_MODE) {
		statics = jsonParseResource(FILEPATH_MANIFEST);
	}
	return `${getToolUrl(app.name, 'exampletool')}/${GETTER_ROOT}/${statics[path]}`;
}
