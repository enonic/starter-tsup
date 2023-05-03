// import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import GlobalsPlugin from 'esbuild-plugin-globals';
import glob from 'glob';
// import {print} from 'q-i';
// import {join} from 'path';
import { defineConfig, type Options } from 'tsup';


const RESOURCES_PATH = 'src/main/resources';
const ASSETS_PATH = `${RESOURCES_PATH}/assets`;
const CLIENT_GLOB_EXTENSIONS = '{tsx,ts,jsx,js}';
const SERVER_GLOB_EXTENSIONS = '{ts,js}';

const CLIENT_FILES = glob.sync(`${ASSETS_PATH}/**/*.${CLIENT_GLOB_EXTENSIONS}`);
// print(CLIENT_FILES, { maxItems: Infinity });

const SERVER_FILES = glob.sync(
	`${RESOURCES_PATH}/**/*.${SERVER_GLOB_EXTENSIONS}`,
	{
		absolute: false,
		ignore: glob.sync(`${ASSETS_PATH}/**/*.${SERVER_GLOB_EXTENSIONS}`)
	}
);
// print(SERVER_FILES, { maxItems: Infinity });

interface MyOptions extends Options {
	d?: string
}

export default defineConfig((options: MyOptions) => {
	// print(options, { maxItems: Infinity });
	if (options.d === 'build/resources/main') {
		return {
			bundle: false, // Every entry dependency becomes it's own file
			entry: SERVER_FILES,
			esbuildOptions(options, context) {
				// options.alias = {
				// 	'alias': './src/main/resources/lib/filename.js'
				// };

				// Some node modules might need globalThis
				// options.banner = {
				// 	js: `const globalThis = (1, eval)('this');`
				// };

				// If you have libs with chunks, use this to avoid collisions
				options.chunkNames = '_chunks/[name]-[hash]';
			},
			esbuildPlugins: [
				// Some node modules might need parts of Node polyfilled:
				// polyfillNode({
				// 	globals: {
				// 		buffer: false,
				// 		process: false
				// 	},
				// 	polyfills: {
				// 		_stream_duplex: false,
				// 		_stream_passthrough: false,
				// 		_stream_readable: false,
				// 		_stream_transform: false,
				// 		_stream_writable: false,
				// 		assert: false,
				// 		'assert/strict': false,
				// 		async_hooks: false,
				// 		buffer: false,
				// 		child_process: false,
				// 		cluster: false,
				// 		console: false,
				// 		constants: false,
				// 		crypto: false,
				// 		dgram: false,
				// 		diagnostics_channel: false,
				// 		dns: false,
				// 		domain: false,
				// 		events: false,
				// 		fs: false,
				// 		'fs/promises': false,
				// 		http: false,
				// 		http2: false,
				// 		https: false,
				// 		module: false,
				// 		net: false,
				// 		os: false,
				// 		path: false,
				// 		perf_hooks: false,
				// 		process: "empty",
				// 		punycode: false,
				// 		querystring: false,
				// 		readline: false,
				// 		repl: false,
				// 		stream: false,
				// 		string_decoder: false,
				// 		sys: false,
				// 		timers: false,
				// 		'timers/promises': false,
				// 		tls: false,
				// 		tty: false,
				// 		url: false,
				// 		util: true,
				// 		v8: false,
				// 		vm: false,
				// 		wasi: false,
				// 		worker_threads: false,
				// 		zlib: false,
				// 	}
				// }) // ReferenceError: "navigator" is not defined
			],
			external: [
				'/lib/cache',
				/^\/lib\/guillotine/,
				'/lib/graphql',
				'/lib/graphql-connection',
				'/lib/http-client',
				'/lib/license',
				'/lib/router',
				'/lib/util',
				'/lib/vanilla',
				'/lib/thymeleaf',
				'/lib/xp/admin',
				'/lib/xp/app',
				'/lib/xp/auditlog',
				'/lib/xp/auth',
				'/lib/xp/cluster',
				'/lib/xp/common',
				'/lib/xp/content',
				'/lib/xp/context',
				'/lib/xp/event',
				'/lib/xp/export',
				'/lib/xp/grid',
				'/lib/xp/i18n',
				'/lib/xp/io',
				'/lib/xp/mail',
				'/lib/xp/node',
				'/lib/xp/portal',
				'/lib/xp/project',
				'/lib/xp/repo',
				'/lib/xp/scheduler',
				'/lib/xp/schema',
				'/lib/xp/task',
				'/lib/xp/value',
				'/lib/xp/vhost',
				'/lib/xp/websocket',
			],
			format: 'cjs',
			inject: [
				// Injects makes it possible to use some functionality in any file :)
				// However it also makes every file larger, unless splitting: true
				// If for some reason you cannot use code splitting, it is better
				// to import a polyfill only in the entries that needs it.
				// Code-js polyfills share code, so together they don't add the sum of all the polyfills.
				// For example injecting both number/is-finite and is-integer only adds 60K, not 108K

				// Here are some things Nashorn doesn't support, comment them in to inject them:
				// 'node_modules/core-js/stable/array/flat.js',        // 69K (18K) minified
				// 'node_modules/core-js/stable/array/includes.js',    // 60K (15K)
				// 'node_modules/core-js/stable/math/trunc.js',        // 53K (14K)
				// 'node_modules/core-js/stable/number/is-finite.js',  // 54K (14K)
				// 'node_modules/core-js/stable/number/is-integer.js', // 54K (14K)
				// 'node_modules/core-js/stable/parse-float.js',       // 59K (15K)
				// 'node_modules/core-js/stable/reflect/index.js',     // 88K (22K)

				// I used this command to find sizes
				// npm --silent run clean && npm --silent run build:server; ls -lh build/resources/main/empty.js; npm --silent run clean && npm --silent run build:server -- --minify; ls -lh build/resources/main/empty.js
			],
			'main-fields': 'main,module',
			minify: false, // Minifying server files makes debugging harder
			noExternal: [],
			platform: 'neutral',
			// silent: true,
			shims: false, // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
			splitting: true,
			sourcemap: false,
			target: 'es5'
		};
	}
	if (options.d === 'build/resources/main/assets') {
		return {
			bundle: true, // Every entry dependency is bundled into the entry
			entry: CLIENT_FILES,

			esbuildPlugins: [
				GlobalsPlugin({
					react: 'React',
				})
			],

			// By default tsup bundles all imported modules, but dependencies
			// and peerDependencies in your packages.json are always excluded
			external: [ // Must be loaded into global scope instead
				// 'react' // ERROR: For GlobalsPlugin to work react must NOT be listed here
			],

			format: [
				'cjs',
				'esm'
			],
			minify: true,
			noExternal: [ // Not loaded into global scope
				'dayjs',
				'react', // WARNING: For GlobalsPlugin to work react MUST be listed here (if react under dependencies or peerDependencies)
			],
			platform: 'browser',
			// silent: true,
			splitting: true,
			sourcemap: true,
			tsconfig: 'src/main/resources/assets/tsconfig.json',
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
