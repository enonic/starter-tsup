//@ts-ignore
import {render} from '/lib/thymeleaf';
import {
	assetUrl as getAssetUrl,
	getContent as getCurrentContent
} from '/lib/xp/portal';


const VIEW = resolve('./examplePage.html');


export function get(request) {
	const {
		displayName,
		page: {
			regions
		}
	} = getCurrentContent();
	const model = {
		assetUrl: getAssetUrl({
			path: ''
		}),
		displayName,
		regions
	};
	return {
		body: render(VIEW, model)
	}
}
