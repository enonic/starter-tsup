import type { ContentSecurityPolicy } from '/index.d';


import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';


export const ABOUT = 'about:';
export const BLOB = 'blob:';
export const DATA = 'data:';
export const FILESYSTEM = 'filesystem:';
export const HTTPS = 'https:';
export const NONE = `'none'`;
export const SELF = `'self'`;
export const STRICT_DYNAMIC = `'strict-dynamic'`;
export const UNSAFE_EVAL = `'unsafe-eval'`;
export const UNSAFE_HASHES = `'unsafe-hashes'`;
export const UNSAFE_INLINE = `'unsafe-inline'`;
export const WS = 'ws:';
export const WSS = 'wss:';

export const CSP_DEFAULT: ContentSecurityPolicy = {
	'default-src': [ NONE ],
	'connect-src': [ SELF ],
	'font-src': [ SELF ],
	'img-src': [ SELF ],
	'script-src': [ SELF ],
	'style-src': [ SELF ],
};

export const CSP_PERMISSIVE: ContentSecurityPolicy = {
	'default-src': [
		'*',
		UNSAFE_EVAL,
		UNSAFE_INLINE,
		DATA,
		FILESYSTEM,
		ABOUT,
		BLOB,
		WS,
		WSS,
	]
};

export function nonce(s: string) {
	return `'nonce-${s}'`;
}

export function pushUniqueValue(stringArray: string[], string: string): number {
	if (!arrayIncludes(stringArray, string)) {
		return stringArray.push(string);
	}
	return -1; // stringArray.length;
}

export function q(s: string) {
	return `'${s}'`;
}

export function sha256(s: string) {
	return `'sha256-${s}'`;
}

export function sha384(s: string) {
	return `'sha384-${s}'`;
}

export function sha512(s: string) {
	return `'sha512-${s}'`;
}

export function contentSecurityPolicy(csp: ContentSecurityPolicy) {
	return Object.keys(csp).map(k => {
		return `${k} ${csp[k].join(' ')}`;
	}).join('; ')
}
