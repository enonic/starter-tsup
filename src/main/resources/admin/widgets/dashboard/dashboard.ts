import type {
	Response,
} from '/index.d';
import { assetUrl } from '/lib/xp/portal';
// @ts-expect-error no-types
import {render} from '/lib/mustache';

export function get (): Response {
	const view = resolve('./dashboard.html');
	return {
		body: render(view, {
			stylesUrl: assetUrl({ path: '/styles/widget.css' }),
		}),
		contentType: 'text/html'
	};
}
