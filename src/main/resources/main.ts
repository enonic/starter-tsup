import { submitTask } from '/lib/xp/task';
import { importedFunction } from './lib/vanilla';
import {DEBUG_MODE} from '/constants'; // Using relative, so it will be inlined (and tree-shaken).

DEBUG_MODE && log.info('Hello from transpiled TS server-side code in main.js.');

// Test that deconstruction works after transpilation.
const obj = { prop: 'Deconstruction works :)' };
const { prop } = obj;
DEBUG_MODE && log.info(prop);

const submitTasks = () => {
	const taskConfig = {
		descriptor: 'task',
		name: `${app.name}:task:nameA`
	};

	// Submit (lib.task.submitTask) two named tasks with identical names to showcase how to intercept duplicate task runs
	submitTask(taskConfig);
	submitTask(taskConfig);
}

// Call an imported function
importedFunction();

// Showcase Task API
submitTasks();
