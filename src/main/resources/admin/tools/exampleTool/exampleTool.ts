import type {
	Request,
	Response,
} from '/index.d';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import { render } from '/lib/mustache';
// @ts-ignore
import Router from '/lib/router';
import {
	getLauncherPath,
	getLauncherUrl,
} from '/lib/xp/admin';
import { assetUrl } from '/lib/xp/portal';
import getImmuteableAdminUrl from './getImmuteableAdminUrl';
import immutableGetter from './immutableGetter';
import { GETTER_ROOT } from '/constants';


const VIEW = resolve('exampleTool.html');


const router = Router();


router.all(`/${GETTER_ROOT}/{path:.+}`, (r: Request) => {
	// log.info('Request:%s', toStr(r));
	return immutableGetter(r);
});


function get(
	request: Request
): Response {
	// log.info('request:%s', toStr(request));

	var params = {
		applicationIconUrl: getImmuteableAdminUrl('icons/application.svg'),
		appUrl: getImmuteableAdminUrl('admin/App.mjs'),
		cssUrl: getImmuteableAdminUrl('admin/App.css'),
		assetsUrl: assetUrl({ path: '' }),
		launcherPath: getLauncherPath(),
		launcherUrl: getLauncherUrl(),
		reactDomUrl: getImmuteableAdminUrl('react/react-dom.development.js'),
		reactUrl: getImmuteableAdminUrl('react/react.development.js'),
	};

	return {
		body: render(VIEW, params)
	};
};

router.get('', (r: Request) => get(r)); // Default admin tool path
router.get('/', (r: Request) => get(r)); // Just in case someone adds a slash on the end

export const all = (r: Request) => router.dispatch(r);
