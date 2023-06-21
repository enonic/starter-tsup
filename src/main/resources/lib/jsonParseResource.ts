import {toStr} from '@enonic/js-utils';
import readResource from '/lib/readResource';
import {DEBUG_MODE} from "/constants";

function jsonParseResource(filename: string) {
	const content = readResource(filename);
	let obj: object;
	try {
		obj = JSON.parse(content);
		DEBUG_MODE && log.debug('jsonParseResource obj:%s', toStr(obj));
	} catch (e) {
		log.error(e.message);
		DEBUG_MODE && log.info("Content dump from '" + filename + "':\n" + content);
		throw new Error(`couldn't parse as JSON content of resource: ${filename}`);
	}
	return obj;
}


export default jsonParseResource;
