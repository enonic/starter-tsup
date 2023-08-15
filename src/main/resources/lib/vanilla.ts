import {DEBUG_MODE} from "/constants";

export function importedFunction() {
	DEBUG_MODE && log.info('Hello from importedFunction() that was transpiled from TS and imported from lib/vanilla.ts.');
    return;
}
