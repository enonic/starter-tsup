export function isUrlScheme(urlScheme: string): boolean {
	const pattern = new RegExp('^[a-zA-Z][+a-zA-Z0-9.-]*:$');
	return pattern.test(urlScheme);
}
