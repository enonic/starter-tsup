import {
	isEnabled as vhostsEnabled,
	list as getVhosts
} from '/lib/xp/vhost';


export default function webappUrl(path: string) {
	const {vhosts} = getVhosts();
	// log.info('vhosts:%s', toStr(vhosts));

	const webappVhost = vhosts.filter(({target}) => target.startsWith('/webapp'))[0];
	// log.info('webappVhost:%s', toStr(webappVhost));

	const base = vhostsEnabled() && webappVhost
		? webappVhost.source
		: `/webapp/${app.name}`;

	return path ? `${base}/${path}` : base;
}
