// import { createHash } from 'crypto';
import GlobalsPlugin from 'esbuild-plugin-globals';
import manifestPlugin from 'esbuild-plugin-manifest';
// import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import { sassPlugin } from 'esbuild-sass-plugin';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import glob from 'glob';
import { sha256 } from 'hash36';
// import { print } from 'q-i';
// import { join } from 'path';
import { defineConfig, type Options } from 'tsup';


const DIR_SRC = 'src/main/resources';
const DIR_SRC_ASSETS = `${DIR_SRC}/assets`;
const DIR_SRC_STATIC = `${DIR_SRC}/static`;

const DIR_DST = 'build/resources/main';
const DIR_DST_STATIC = `${DIR_DST}/static`;

const GLOB_EXTENSIONS_ASSETS = '{tsx,ts,jsx,js}';
const GLOB_EXTENSIONS_SERVER = '{ts,js}';

const FILES_ASSETS = glob.sync(`${DIR_SRC_ASSETS}/**/*.${GLOB_EXTENSIONS_ASSETS}`);
// print(FILES_ASSETS, { maxItems: Infinity });

const FILES_SERVER = glob.sync(
	`${DIR_SRC}/**/*.${GLOB_EXTENSIONS_SERVER}`,
	{
		absolute: false,
		ignore: [].concat(
			glob.sync(`${DIR_SRC_ASSETS}/**/*.${GLOB_EXTENSIONS_SERVER}`),
			glob.sync(`${DIR_SRC_STATIC}/**/*.${GLOB_EXTENSIONS_SERVER}`)
		)
	}
);
// print(FILES_SERVER, { maxItems: Infinity });

interface MyOptions extends Options {
	d?: string
}

export default defineConfig((options: MyOptions) => {
	// print(options, { maxItems: Infinity });
	// print(process.env, { maxItems: Infinity });
	// print({ NODE_ENV: process.env.NODE_ENV });
	if (options.d === DIR_DST) {
		return {
			bundle: true, // Needed to bundle @enonic/js-utils
			entry: FILES_SERVER,
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
				'/lib/enonic/static',
				/^\/lib\/guillotine/,
				'/lib/graphql',
				'/lib/graphql-connection',
				'/lib/http-client',
				'/lib/license',
				'/lib/router',
				'/lib/util',
				'/lib/vanilla',
				'/lib/thymeleaf',
				/^\/lib\/xp\//,
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

				// TIP: I used this command to find sizes
				// npm --silent run clean && npm --silent run build:server; ls -lh build/resources/main/empty.js; npm --silent run clean && npm --silent run build:server -- --minify; ls -lh build/resources/main/empty.js
			],
			'main-fields': 'main,module',
			minify: false, // Minifying server files makes debugging harder

			// TIP: Command to check if there are any bad requires left behind
			// grep -r 'require("' build/resources/main | grep -v 'require("/'|grep -v chunk
			noExternal: [
				/^@enonic\/js-utils.*$/,
			],

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
			bundle: true, // Needed to bundle @enonic/js-utils and dayjs
			entry: FILES_ASSETS,
			esbuildPlugins: [],

			// By default tsup bundles all imported modules, but dependencies
			// and peerDependencies in your packages.json are always excluded
			external: [ // Must be loaded into global scope instead
			],

			format: [
				// 'cjs', // Legacy browser support
				'esm',
			],
			minify: process.env.NODE_ENV === 'development' ? false : true,

			// TIP: Command to check if there are any bad requires left behind
			// grep -r 'require("' build/resources/main | grep -v 'require("/'|grep -v chunk
			noExternal: [
				/^@enonic\/js-utils/,
			],

			platform: 'browser',
			// silent: true,
			splitting: true,
			sourcemap: process.env.NODE_ENV === 'development' ? false : true,
			tsconfig: 'src/main/resources/assets/tsconfig.json',
		};
	}
	if (options.d === 'build/resources/main/static') {
		const fileBuffer = readFileSync('node_modules/react/umd/react.development.js');
		const digest = sha256(fileBuffer);
		// print({digest});
		const fileBuffer2 = readFileSync('node_modules/react-dom/umd/react-dom.development.js');
		const digest2 = sha256(fileBuffer2);
		const manifestObj = {
			'react/react.development.js': `react/react.development-${digest}.js`,
			'react/react-dom.development.js': `react/react-dom.development-${digest2}.js`
		}
		// print({manifestObj});
		mkdirSync(
			`${DIR_DST_STATIC}/react`,
			{
				recursive: true
			}
		);
		writeFileSync(`${DIR_DST_STATIC}/react/manifest.json`, JSON.stringify(manifestObj,null,4));
		writeFileSync(`${DIR_DST_STATIC}/react/react.development-${digest}.js`, fileBuffer);
		writeFileSync(`${DIR_DST_STATIC}/react/react-dom.development-${digest2}.js`, fileBuffer2);

		const FILES_STATIC = glob.sync(`${DIR_SRC_STATIC}/**/*.${GLOB_EXTENSIONS_ASSETS}`);
		// print(FILES_STATIC, { maxItems: Infinity });

		const entry = {};
		for (let i = 0; i < FILES_STATIC.length; i++) {
			const element = FILES_STATIC[i];
			entry[element
				.replace(`${DIR_SRC_STATIC}/`, '') // Remove path
				.replace(/\.[^.]+$/, '') // Remove extension
			] = element;
		}
		// print({entry}, { maxItems: Infinity });

		const obj = {};
		return {
			bundle: true, // Needed to bundle @enonic/js-utils and dayjs
			entry,

			esbuildPlugins: [
				GlobalsPlugin({
					react: 'React',
				}),
				manifestPlugin({
					//filename: '[name]',
					generate: (entries) => {// Executed once per format
						// print(entries, { maxItems: Infinity });
						// const obj = {} as typeof entries;
						Object.entries(entries).forEach(([k,v]) => {
							const ext = v.split('.').pop() as string;
							const parts = k.replace(`${DIR_SRC_STATIC}/`, '').split('.');
							parts.pop();
							parts.push(ext);
							obj[parts.join('.')] = v.replace(`${DIR_DST_STATIC}/`, '');
						});
						return obj;
					}
				}),
				sassPlugin(),
			],

			// By default tsup bundles all imported modules, but dependencies
			// and peerDependencies in your packages.json are always excluded
			external: [ // Must be loaded into global scope instead
				// 'react' // ERROR: For GlobalsPlugin to work react must NOT be listed here
			],

			format: [
				'cjs', // Legacy browser support, also css in manifest.json
				'esm', // For some reason doesn't report css files in manifest.json
			],
			minify: process.env.NODE_ENV === 'development' ? false : true,

			// TIP: Command to check if there are any bad requires left behind
			// grep -r 'require("' build/resources/main | grep -v 'require("/'|grep -v chunk
			noExternal: [
				/^@enonic\/js-utils/,
				'dayjs', // Not loaded into global scope
				'react', // WARNING: For GlobalsPlugin to work react MUST be listed here (if react under dependencies or peerDependencies)
			],

			platform: 'browser',
			// silent: true,
			splitting: true,
			sourcemap: process.env.NODE_ENV === 'development' ? false : true,
			tsconfig: 'src/main/resources/static/tsconfig.json',
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
