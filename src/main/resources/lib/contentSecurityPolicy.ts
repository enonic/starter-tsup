import type { ContentSecurityPolicy } from '/index.d';


function q(s: string) {
	return `'${s}'`;
}

// TODO: Actually urls must be unqouted, so the code below is wrong!

export default function contentSecurityPolicy(csp: ContentSecurityPolicy) {
	return Object.keys(csp).map(k => {
		const v = csp[k];
		return `${k} ${Array.isArray(v) ? v.map(s =>q(s)).join(' ') : q(v)}`;
	}).join('; ')
}
