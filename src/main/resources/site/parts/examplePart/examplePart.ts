//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';


const VIEW = resolve('./examplePart.html');


export function get(request) {
	const {
		config: {
			myProperty = 'Fallback text'
		}
	} = getComponent<{
		myProperty?: string
	}>();
	const model = {
		myProperty
	};
	return {
		body: render(VIEW, model)
	}
}
