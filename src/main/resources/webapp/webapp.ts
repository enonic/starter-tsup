import type {
	Request,
	Response,
} from '/index.d';

// @ts-expect-error TS2307: Cannot find module '/lib/router' or its corresponding type declarations.
import Router from '/lib/router';
import { immutableGetter, getWebappUrl } from '/lib/urlHelper';
import {
	DEBUG_MODE,
	FILEPATH_MANIFEST_CJS,
	FILEPATH_MANIFEST_NODE_MODULES,
	GETTER_ROOT
} from '/constants';

const router = Router();

router.all(`/${GETTER_ROOT}/{path:.+}`, (r: Request) => {
	return immutableGetter(r);
});

const htmlResponse = (_request: Request): Response => {
	DEBUG_MODE && log.info('Hello from the webapp controller!');
	return {
		body: `<html>
	<head>
		<script type="text/javascript" src="${getWebappUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react/umd/react.development.js'
		})}"></script>
		<script type="text/javascript" src="${getWebappUrl({
			manifestPath: FILEPATH_MANIFEST_NODE_MODULES,
			path: 'react-dom/umd/react-dom.development.js'
		})}"></script>
		<link rel="stylesheet" media="all" href="${getWebappUrl({
			manifestPath: FILEPATH_MANIFEST_CJS,
			path: 'react/App.css'
		})}">
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
		<title>Webapp</title>
	</head>
	<body style="font-size:13px">
		<div id="react-root"></div>
		<script type='module' defer>
	import {App} from '${getWebappUrl({ path: 'react/App.mjs' })}';
	const root = ReactDOM.createRoot(document.getElementById('react-root'));
	root.render(React.createElement(App, { header: 'Hello from React inside a web app!' }));
		</script>
	</body>
</html>`
	};
}

router.get('/', (r: Request) => htmlResponse(r));
router.get('', (r: Request) => htmlResponse(r)); // This doesn't work?

export const all = (r: Request) => router.dispatch(r);
