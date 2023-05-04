import {
	getResource,
	readText
} from '/lib/xp/io';


function readResource(filename: string) {
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


export default readResource;
