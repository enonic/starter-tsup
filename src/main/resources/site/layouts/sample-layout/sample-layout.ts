import { Region } from '/lib/xp/portal';
import type {
	// Request,
	Response,
} from '/index.d';


// @ts-expect-error no-types
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';
import {DEBUG_MODE} from '/constants';


const VIEW = resolve('./sample-layout.html');


export function get(/*request: Request*/): Response {
	DEBUG_MODE && log.info('Hello from the layout controller!');

	const {
		regions
	} = getComponent() as {regions: Record<string,Region>};
	const model = {
		regions
	};
	log.info(JSON.stringify(model, null, 4));
	return {
		body: render(VIEW, model)
	}
}
