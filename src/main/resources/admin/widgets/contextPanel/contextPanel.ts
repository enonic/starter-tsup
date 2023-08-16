import type {
	Response,
} from '/index.d';

export function get(): Response {
	return {
		body: `<widget
style="position: absolute;
top: 50%;
display: flex;
justify-content: center;
width: 100%;
font-size: 14px;">This is a Context Widget</widget>`,
		contentType: 'text/html'
	};
}
