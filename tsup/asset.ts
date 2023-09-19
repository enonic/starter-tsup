import type { Options } from '.';


import { globSync } from 'glob';
// import { print } from 'q-i';
import { DIR_SRC_ASSETS } from './constants';


export default function buildAssetConfig(): Options {
	const GLOB_EXTENSIONS_ASSETS = '{tsx,ts,jsx,js}';
	const FILES_ASSETS = globSync(`${DIR_SRC_ASSETS}/**/*.${GLOB_EXTENSIONS_ASSETS}`).map(s => s.replaceAll('\\', '/'));
	// print(FILES_ASSETS, { maxItems: Infinity });
	return {
		bundle: true, // Needed to bundle @enonic/js-utils and dayjs
		dts: false, // d.ts files are use useless at runtime
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
		silent: ['QUIET', 'WARN'].includes(process.env.LOG_LEVEL_FROM_GRADLE||''),
		splitting: true,
		sourcemap: process.env.NODE_ENV === 'development' ? false : true,
		tsconfig: 'src/main/resources/assets/tsconfig.json',
	};
}
