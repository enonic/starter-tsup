import type { Options } from './tsup';

import { defineConfig } from 'tsup';
import { DIR_DST, DIR_DST_ASSETS, DIR_DST_STATIC } from './tsup/constants';


export default defineConfig((options: Options) => {
	if (options.d === DIR_DST) {
		return import('./tsup/server').then(m => m.default());
	}
	if (options.d === DIR_DST_ASSETS) {
		return import('./tsup/client-asset').then(m => m.default());
	}
	if (options.d === DIR_DST_STATIC) {
		return import('./tsup/client-static').then(m => m.default());
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
