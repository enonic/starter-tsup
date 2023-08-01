import {toStr} from '@enonic/js-utils';
import {DEBUG_MODE} from '../constants';
import {getResource, readText} from '/lib/xp/io';

export function readResource(filename: string) {
	const resource = getResource(filename);
	if (!resource || !resource.exists()) {
		throw new Error(`Empty or not found: ${filename}`);
	}
	let content: string;
	try {
		content = readText(resource.getStream());
		// log.debug('readResource: filename:%s content:%s', filename, content);
	} catch (e) {
		log.error(e.message);
		throw new Error(`Couldn't read resource: ${filename}`);
	}
	return content;
}

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
