import type {
	Response,
} from '/index.d';
import { assetUrl } from '/lib/xp/portal';

export function get(): Response {
	return {
		body: `<widget id="widget-menuitem">
					<link rel="stylesheet" href="${assetUrl({ path: '/styles/widget.css' })}" type="text/css" media="all"/>
					<h6>This is a Menu Widget. It can be opened from the menu on the left-hand side.</h6>
				</widget>`,
		contentType: 'text/html'
	};
}
