import { submitTask } from '/lib/xp/task';
// import { importedFunction } from '/lib/vanilla'; // Using absolute path, so it will match external in tsup.config.ts
import { importedFunction } from './lib/vanilla'; // Using relative, so it will be inlined (and tree-shaken).

log.info('main: Hello from transpiled typescript server-side code.');

// Test that descontruction works after transpilation.
const obj = { prop: 'Decontruction works :)' };
const { prop } = obj;
log.info(prop);

importedFunction();

submitTask({ descriptor:'testRepoConnectionQuery' });
