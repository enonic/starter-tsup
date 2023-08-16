import type {
	Response,
} from '/index.d';

export function get(): Response {
	return {
		body: `<widget style="margin-top: -44px;height: 100vh;display: flex;align-items: center;justify-content: center;">
					<h6>This is a Menu Widget. It can be opened from the menu on the left-hand side.</h6>
				</widget>`,
		contentType: 'text/html'
	};
}
