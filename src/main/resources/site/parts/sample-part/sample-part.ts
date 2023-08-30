import type {
	// Request,
	Response,
} from '/index.d';


//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';
import {DEBUG_MODE} from '/constants';


const VIEW = resolve('./sample-part.html');


export function get(/*request: Request*/): Response {
	DEBUG_MODE && log.info('Hello from the part controller!');
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
