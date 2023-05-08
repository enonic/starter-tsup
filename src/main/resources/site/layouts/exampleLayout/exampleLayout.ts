import { Region } from '/lib/xp/portal';
import type {
	// Request,
	Response,
} from '/index.d';


//@ts-ignore
import {render} from '/lib/thymeleaf';
import {getComponent} from '/lib/xp/portal';


const VIEW = resolve('./exampleLayout.html');


export function get(/*request: Request*/): Response {
	const {
		regions
	} = getComponent() as {regions: Record<string,Region>};
	const model = {
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
