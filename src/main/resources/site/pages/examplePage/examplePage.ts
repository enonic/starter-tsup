//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getContent as getCurrentContent} from '/lib/xp/portal';


const VIEW = resolve('./examplePage.html');


export function get(request) {
	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();
	const model = {
		displayName,
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
