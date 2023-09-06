import type {
	// Request,
	Response,
} from '/index.d';


// import { toStr } from '@enonic/js-utils/value/toStr';
import {
	base64Encode,
	sha256AsStream,
	// @ts-ignore
} from '/lib/text-encoding';
import { getComponent } from '/lib/xp/portal';
import { getSiteUrl } from '/lib/urlHelper';
import { IS_PROD_MODE } from '/lib/runMode';
import {
	CSP_DEFAULT,
	UNSAFE_INLINE,
	contentSecurityPolicy,
	pushUniqueValue,
	sha256
} from '/lib/contentSecurityPolicy';

export function get(/*request: Request*/): Response {
	const component = getComponent() as {
		config: {
			myProperty?: string
		},
		path: string
	};
	// log.info('component:%s', toStr(component));
	const {
		config: {
			myProperty = 'Fallback text'
		},
		path
	} = component;
	const inlineScript = `import Component from '${getSiteUrl({
		path: 'svelte/Component.mjs'
	})}';
	new Component({
		target: document.getElementById('${path}'),
		props: {
			myProperty: '${myProperty}'
		}
	})`;
	const response: Response = {
		body: `<div id="${path}"/>`,
		pageContributions: {
			bodyEnd: [
				`<script type="module">${inlineScript}</script>`
			]
		}
	}
	if (IS_PROD_MODE) {
		const base64 = base64Encode(sha256AsStream(inlineScript));
		const csp = CSP_DEFAULT;
		pushUniqueValue(csp['script-src'], sha256(base64));
		pushUniqueValue(csp['style-src'], UNSAFE_INLINE);
		response.headers = {'content-security-policy': contentSecurityPolicy(csp)};
	}
	return response;
}
