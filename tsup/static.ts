import type { Options } from '.';

import GlobalsPlugin from 'esbuild-plugin-globals';
import TsupPluginManifest from '@enonic/tsup-plugin-manifest';
import { sassPlugin } from 'esbuild-sass-plugin';
import CopyWithHashPlugin from '@enonic/esbuild-plugin-copy-with-hash';

import { globSync } from 'glob';
// import { print } from 'q-i';
import {
	DIR_DST,
	DIR_SRC_STATIC
} from './constants';


export default function buildStaticConfig(): Options {
	const DIR_DST_STATIC = `${DIR_DST}/static`;
	const GLOB_EXTENSIONS_STATIC = '{tsx,ts,jsx,js,svelte}';
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
			CopyWithHashPlugin({
				context: 'node_modules',
				manifest: `node_modules-manifest.json`,
				patterns: [
					'react/{cjs,umd}/*.js',
					'react-dom/{cjs,umd}/*.js',
				]
			}),
			GlobalsPlugin({
				react: 'React',
			}),
			TsupPluginManifest({
				generate: (entries) => {// Executed once per format
					const newEntries = {};
					Object.entries(entries).forEach(([k,v]) => {
						console.log(k,v);
						const ext = v.split('.').pop() as string;
						const parts = k.replace(`${DIR_SRC_STATIC}/`, '').split('.');
						parts.pop();
						parts.push(ext);
						newEntries[parts.join('.')] = v.replace(`${DIR_DST_STATIC}/`, '');
					});
					return newEntries;
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
			'cjs', // Legacy browser support, also css in manifest.cjs.json
			'esm', // cjs needed because css files are not reported in manifest.esm.json
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
