//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';


const VIEW = resolve('./exampleLayout.html');


export function get(request) {
	const {
		regions
	} = getComponent();
	const model = {
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
