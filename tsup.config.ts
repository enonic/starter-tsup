import glob from 'glob';
import {print} from 'q-i';
import {join} from 'path';
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
			//bundle: true,
			entry: SERVER_FILES,
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
			silent: true,
			shims: false, // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
			splitting: true,
			sourcemap: false,
			target: 'es5'
		};
	}
	if (options.d === 'build/resources/main/assets') {
		return {
			entry: CLIENT_FILES,
			external: [
				'react'
			],
			format: [
				'cjs',
				'esm'
			],
			minify: true,
			platform: 'browser',
			sourcemap: true,
			tsconfig: 'src/main/resources/assets/tsconfig.json',
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
