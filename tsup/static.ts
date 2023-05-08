import type { Options } from '.';


import GlobalsPlugin from 'esbuild-plugin-globals';
import manifestPlugin from 'esbuild-plugin-manifest';
import { sassPlugin } from 'esbuild-sass-plugin';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { sha256 } from 'hash36';
// import { print } from 'q-i';
import {
	DIR_DST,
	DIR_SRC_STATIC
} from './constants';


export default function buildStaticConfig(): Options {
	const DIR_DST_STATIC = `${DIR_DST}/static`;
	const GLOB_EXTENSIONS_STATIC = '{tsx,ts,jsx,js}';

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

	const obj = {};
	return {
		bundle: true, // Needed to bundle @enonic/js-utils and dayjs
		dts: false, // d.ts files are use useless at runtime
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
		silent: ['QUIET', 'WARN'].includes(process.env.LOG_LEVEL_FROM_GRADLE||''),
		splitting: true,
		sourcemap: process.env.NODE_ENV === 'development' ? false : true,
		tsconfig: 'src/main/resources/static/tsconfig.json',
	};
}
