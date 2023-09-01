import type { ContentSecurityPolicy } from '/index.d';

export const NONE = `'none'`;
export const SELF = `'self'`;
export const UNSAFE_EVAL = `'unsafe-eval'`;
export const UNSAFE_INLINE = `'unsafe-inline'`;

export const CSP_DEFAULT: ContentSecurityPolicy = {
	'default-src': NONE,
	'connect-src': SELF,
	'font-src': SELF,
	'img-src': SELF,
	'script-src': [
		SELF
	],
	'style-src': [
		SELF
	]
};

export const CSP_PERMISSIVE: ContentSecurityPolicy = {
	'default-src': [
		'*',
		UNSAFE_EVAL,
		UNSAFE_INLINE,
		'data:',
		'filesystem:',
		'about:',
		'blob:',
		'ws:',
		'wss:'
	]
};

export function q(s: string) {
	return `'${s}'`;
}

export function contentSecurityPolicy(csp: ContentSecurityPolicy) {
	return Object.keys(csp).map(k => {
		const v = csp[k];
		return `${k} ${Array.isArray(v) ? v.map(s => s).join(' ') : v}`;
	}).join('; ')
}
