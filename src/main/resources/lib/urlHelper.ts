import ioResource from './ioResource';
import {
	getSite,
	pageUrl as getPageUrl,
} from '/lib/xp/portal';
import { getToolUrl } from '/lib/xp/admin';
import {IS_DEV_MODE} from './runMode';
import {
	DEBUG_MODE,
	FILEPATH_MANIFEST_CJS,
	FILEPATH_MANIFEST_ESM,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT,
} from '../constants';
import {isEnabled as vhostsEnabled, list as getVhosts} from '/lib/xp/vhost';
import {Request, Response} from '/types';
import {toStr} from '@enonic/js-utils';
import {startsWith} from '@enonic/js-utils/string/startsWith';

// @ts-expect-error TS2307: Cannot find module '/lib/enonic/static' or its corresponding type declarations.
import {buildGetter} from '/lib/enonic/static';

const manifests = {
	[FILEPATH_MANIFEST_CJS]: ioResource(FILEPATH_MANIFEST_CJS),
	[FILEPATH_MANIFEST_ESM]: ioResource(FILEPATH_MANIFEST_ESM),
	[FILEPATH_MANIFEST_NODE_MODULES]: ioResource(FILEPATH_MANIFEST_NODE_MODULES),
}

type UrlPostfixParams = {
	manifestPath?: string
	path: string,
};

type UrlParams = UrlPostfixParams & {urlPrefix: string};

const getImmutableUrl = ({
	manifestPath = FILEPATH_MANIFEST_ESM,
	path,
	urlPrefix
}: UrlParams) => {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = ioResource(manifestPath);
	}

	return `${urlPrefix}/${GETTER_ROOT}/${manifests[manifestPath][path]}`;
}

export const getWebappUrl = (path?: string) => {
	const {vhosts} = getVhosts();
	const webappVhost = vhosts.filter(({target}) => startsWith(target, '/webapp'))[0];

	const base = vhostsEnabled() && webappVhost
		? webappVhost.source
		: `/webapp/${app.name}`;

	return path ? `${base}/${path}` : base;
}

export const getSiteUrl = ({
	manifestPath = FILEPATH_MANIFEST_ESM,
	path,
}: UrlPostfixParams) => {
	const sitePath = getSite()._path;
	let urlPrefix = getPageUrl({
		path: sitePath
	});
	if (urlPrefix === '/') {
		urlPrefix = '';
	}

	return getImmutableUrl({
		manifestPath,
		path,
		urlPrefix
	});
}

export const getAdminUrl = ({
	manifestPath = FILEPATH_MANIFEST_ESM,
	path,
}: UrlPostfixParams, tool: string) => {
	const urlPrefix = getToolUrl(app.name, tool);

	return getImmutableUrl({
		manifestPath,
		path,
		urlPrefix
	});
}

export const getImmutableWebappUrl = ({
	   manifestPath = FILEPATH_MANIFEST_ESM,
	   path,
   }: UrlPostfixParams) => {
	if (IS_DEV_MODE) {
		manifests[manifestPath] = ioResource(manifestPath);
	}
	return getWebappUrl(`${GETTER_ROOT}/${manifests[manifestPath][path]}`);
}

export const immutableGetter = buildGetter({
	etag: false, // default is true in production and false in development
	getCleanPath: (request: Request) => {
		DEBUG_MODE && log.info('request:%s', toStr(request));
		DEBUG_MODE && log.info('contextPath:%s', request.contextPath);
		DEBUG_MODE && log.info('rawPath:%s', request.rawPath);

		const prefix = request.contextPath;
		let cleanPath = prefix ? request.rawPath.substring(prefix.length) : request.rawPath;
		cleanPath = cleanPath.replace(`${GETTER_ROOT}/`, '');

		DEBUG_MODE && log.info('cleanPath:%s', cleanPath);

		return cleanPath;
	},
	root: GETTER_ROOT
}) as (_request: Request) => Response;
