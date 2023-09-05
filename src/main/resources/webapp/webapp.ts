import type {
	Request,
	Response,
} from '/index.d';

// @ts-expect-error TS2307: Cannot find module '/lib/router' or its corresponding type declarations.
import Router from '/lib/router';
import {
	getBrowserSyncScript,
	isRunning
} from '/lib/browserSync';
import {
	DIRECTIVES_PERMISSIVE,
	ContentSecurityPolicy,
} from '/lib/csp';
import { IS_DEV_MODE } from '/lib/runMode';
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

const htmlResponse = (request: Request): Response => {
	DEBUG_MODE && log.info('Hello from the webapp controller!');

	let browserSyncScript = '';
	if (IS_DEV_MODE) {
		if (isRunning({ request })) {
			browserSyncScript = getBrowserSyncScript({ request });
		} else {
			log.info('HINT: You are running Enonic XP in development mode, however, BrowserSync is not running.');
		}
	}

	const response: Response = {
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
		${browserSyncScript}
	</body>
</html>`
	};

	if(IS_DEV_MODE) {
		response.headers = {
			'content-security-policy': new ContentSecurityPolicy(DIRECTIVES_PERMISSIVE).toString()
		};
	}

	return response;
}

router.get('/', (r: Request) => htmlResponse(r));
router.get('', (r: Request) => htmlResponse(r)); // This doesn't work?

export const all = (r: Request) => router.dispatch(r);
