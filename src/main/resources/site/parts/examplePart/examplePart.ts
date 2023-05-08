import type {
	// Request,
	Response,
} from '/index.d';


//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';


const VIEW = resolve('./examplePart.html');


export function get(/*request: Request*/): Response {
	const {
		config: {
			myProperty = 'Fallback text'
		}
	} = getComponent() as {
		config: {
			myProperty?: string
		}
	};
	const model = {
		myProperty
	};
	return {
		body: render(VIEW, model)
	}
}
