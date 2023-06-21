import { submitTask } from '/lib/xp/task';
import { importedFunction } from './lib/vanilla';
import {DEBUG_MODE} from "/constants"; // Using relative, so it will be inlined (and tree-shaken).

DEBUG_MODE && log.info('main: Hello from transpiled typescript server-side code.');

// Test that descontruction works after transpilation.
const obj = { prop: 'Decontruction works :)' };
const { prop } = obj;
DEBUG_MODE && log.info(prop);

importedFunction();

submitTask({
	descriptor: 'testRepoConnectionQuery',
	// @ts-expect-error: TS2345: Argument of type '{ descriptor: string; name: string; }' is not assignable to parameter of type 'SubmitTaskParams<Record<string, unknown>>'.
	name: `${app.name}:testRepoConnectionQuery:nameA`
})
submitTask({
	descriptor: 'testRepoConnectionQuery',
	// @ts-expect-error: TS2345: Argument of type '{ descriptor: string; name: string; }' is not assignable to parameter of type 'SubmitTaskParams<Record<string, unknown>>'.
	name: `${app.name}:testRepoConnectionQuery:nameA`
});
// submitTask({ descriptor:'testContentQuery' });
