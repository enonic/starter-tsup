import type { Options } from './tsup';


// import { print } from 'q-i';
import { defineConfig } from 'tsup';
import { DIR_DST } from './tsup/constants';


export default defineConfig((options: Options) => {
	// print(options, { maxItems: Infinity });
	// print(process.env, { maxItems: Infinity });
	// print({ NODE_ENV: process.env.NODE_ENV }); // production development
	// print({ LOG_LEVEL_FROM_GRADLE: process.env.LOG_LEVEL_FROM_GRADLE }); // QUIET WARN LIFECYCLE INFO DEBUG
	if (options.d === DIR_DST) {
		return import('./tsup/server').then(m => m.default());
	}
	if (options.d === 'build/resources/main/assets') {
		return import('./tsup/asset').then(m => m.default());
	}
	if (options.d === 'build/resources/main/static') {
		return import('./tsup/static').then(m => m.default());
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
