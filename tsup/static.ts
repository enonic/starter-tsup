import type { Options } from '.';

import GlobalsPlugin from 'esbuild-plugin-globals';
import manifestPlugin from 'esbuild-plugin-manifest';
import { sassPlugin } from 'esbuild-sass-plugin';
// import writeFilePlugin from 'esbuild-plugin-write-file';
// import copyPlugin from "@sprout2000/esbuild-copy-plugin";
import copyFilesPlugin from "esbuild-copy-files-plugin"
import { xxh3 } from '@node-rs/xxhash';
import {
	mkdirSync,
	readFileSync,
	writeFileSync
} from 'fs';
import { globSync } from 'glob';
import { print } from 'q-i';
import {
	DIR_DST,
	DIR_SRC_STATIC
} from './constants';

const BASE_63 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';
const BASE_62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE_36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function bigint2base(x: bigint, baseDigits: string ) {

	let base = BigInt( baseDigits.length );
	let result = '';

	while ( 0 < x ) {
		result = baseDigits.charAt( Number( x % base ) ) + result;
		x = x / base;
	}

	return result || '0';

}

function rshift(b: bigint, size: number): bigint {
	return b >> BigInt(size);
}

function sum(b: bigint) {
	return [
		bigint2base(rshift(b,56),BASE_36).charAt(0),
		bigint2base(rshift(b,48),BASE_36).charAt(0),
		bigint2base(rshift(b,40),BASE_36).charAt(0),
		bigint2base(rshift(b,32),BASE_36).charAt(0),
		bigint2base(rshift(b,24),BASE_36).charAt(0),
		bigint2base(rshift(b,16),BASE_36).charAt(0),
		bigint2base(rshift(b,8),BASE_36).charAt(0),
		bigint2base(b,BASE_36).charAt(0),
	].join('');
}

export default function buildStaticConfig(): Options {
	const DIR_DST_STATIC = `${DIR_DST}/static`;
	const GLOB_EXTENSIONS_STATIC = '{tsx,ts,jsx,js}';

	const fileBuffer = readFileSync('node_modules/react/umd/react.development.js');
	const digest = sum(xxh3.xxh64(fileBuffer));

	const fileBuffer2 = readFileSync('node_modules/react-dom/umd/react-dom.development.js');
	const digest2 = sum(xxh3.xxh64(fileBuffer2));

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
	writeFileSync(`${DIR_DST_STATIC}/react/react.development-${digest}.js`, fileBuffer);
	writeFileSync(`${DIR_DST_STATIC}/react/react-dom.development-${digest2}.js`, fileBuffer2);

	const FILES_STATIC = globSync(`${DIR_SRC_STATIC}/**/*.${GLOB_EXTENSIONS_STATIC}`);
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

	return {
		bundle: true, // Needed to bundle @enonic/js-utils and dayjs
		dts: false, // d.ts files are use useless at runtime
		entry,

		esbuildPlugins: [
			// copyPlugin.copyPlugin({
			// 	// A file
			// 	// src: 'node_modules/react/umd/react.development.js',
			// 	// dest: `${DIR_DST_STATIC}/whatever/react.development.js`
			// 	// A folder
			// 	src: 'node_modules/react/umd',
			// 	dest: `${DIR_DST_STATIC}/whatever`
			// 	// Doesn't support multiple folders!!!
			// }),
			copyFilesPlugin({ // Doesn't support multiple targets?
				source: [
					'node_modules/react/umd/react.development.js',
					'node_modules/react-dom/umd/react-dom.development.js'
				],
				target: `${DIR_DST_STATIC}/whatever`
			}),
			GlobalsPlugin({
				react: 'React',
			}),
			manifestPlugin({
				// filename: `../../../tmp/manifest.json`,
				// filename: (options) => {
				// 	// print({TSUP_FORMAT: options?.define?.['TSUP_FORMAT']}, { maxItems: Infinity });
				// 	const format = options?.define?.['TSUP_FORMAT'].replace(/"/g,'')
				// 	return `manifest.${format}.json`;
				// },
				generate: (entries) => {// Executed once per format
					// print(entries, { maxItems: Infinity });
					Object.entries(entries).forEach(([k,v]) => {
						const ext = v.split('.').pop() as string;
						const parts = k.replace(`${DIR_SRC_STATIC}/`, '').split('.');
						parts.pop();
						parts.push(ext);
						manifestObj[parts.join('.')] = v.replace(`${DIR_DST_STATIC}/`, '');
					});
					return manifestObj;
				}
			}),
			sassPlugin(),
			// writeFilePlugin({
			// 	after: {
			// 		[`${DIR_DST_STATIC}/manifest.json`]: JSON.stringify(manifestObj, null, 2) // Doesn't work, manifestObj only contains react
			// 	}
			// }),
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
		silent: ['QUIET', 'WARN'].includes(process.env.LOG_LEVEL_FROM_GRADLE||''),
		splitting: true,
		sourcemap: process.env.NODE_ENV === 'development' ? false : true,
		tsconfig: 'src/main/resources/static/tsconfig.json',
	};
}
