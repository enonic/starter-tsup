import { submitTask } from '/lib/xp/task';
import { importedFunction } from './lib/vanilla';
import {DEBUG_MODE} from "/constants"; // Using relative, so it will be inlined (and tree-shaken).

DEBUG_MODE && log.info('main: Hello from transpiled typescript server-side code.');

// Test that descontruction works after transpilation.
const obj = { prop: 'Deconstruction works :)' };
const { prop } = obj;
DEBUG_MODE && log.info(prop);

importedFunction();

submitTask({
	descriptor: 'testRepoConnectionQuery',
	name: `${app.name}:testRepoConnectionQuery:nameA`
})
submitTask({
	descriptor: 'testRepoConnectionQuery',
	name: `${app.name}:testRepoConnectionQuery:nameA`
});
// submitTask({ descriptor:'testContentQuery' });
