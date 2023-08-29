import {toStr} from '@enonic/js-utils';
import {startsWith} from '@enonic/js-utils/string/startsWith';
import {
	isEnabled as vhostsEnabled,
	list as getVhosts
} from '/lib/xp/vhost';
import {DEBUG_MODE} from "../constants";


export default function webappUrl(path?: string) {
	const {vhosts} = getVhosts();
	DEBUG_MODE && log.info('vhosts:%s', toStr(vhosts));

	const webappVhost = vhosts.filter(({target}) => startsWith(target, '/webapp'))[0];
	DEBUG_MODE && log.info('webappVhost:%s', toStr(webappVhost));

	const base = vhostsEnabled() && webappVhost
		? webappVhost.source
		: `/webapp/${app.name}`;

	return path ? `${base}/${path}` : base;
}
