import {
	TASK_STATE_RUNNING,
	TASK_STATE_WAITING,
	arrayIncludes,
	toStr
} from '@enonic/js-utils';

import {
	get as getTask,
	list as listTasks,
} from '/lib/xp/task';
import {DEBUG_MODE} from "/constants";

export function run(config, taskId) {
	DEBUG_MODE && log.info('Submitting task from "tasks/testRepoConnectionQuery/testRepoConnectionQuery.ts"...');
	//DEBUG_MODE && log.info('Task config: %s', toStr(config));
	//DEBUG_MODE && log.info('Task Id: %s', taskId);

	const task = getTask(taskId);
	DEBUG_MODE && log.info('Task details (lib-task.get): %s', toStr(task));

	const {
		startTime: myStartTime,
		name: myTaskName
	} = task;

	const taskList = listTasks({
		// name: `${app.name}.test-task`,
		// state: 'RUNNING'
	});
	DEBUG_MODE && log.info('List of tasks (lib-task.list): %s', toStr(taskList));

	for (let index = 0; index < taskList.length; index++) {
		const {state} = taskList[index];
		if (!arrayIncludes([TASK_STATE_RUNNING,TASK_STATE_WAITING],state)) {
			continue;
		}
		const {
			id: aTaskId,
			name: aTaskName,
			startTime: aStartTime,
		} = taskList[index];
		if (aTaskName === myTaskName && aTaskId !== taskId) {
			DEBUG_MODE && log.info('Found two tasks with the same name (%s) and different ids (%s, %s)', myTaskName, aTaskId, taskId);
			if (myStartTime > aStartTime) {
				log.warning('Aborting task %s with newest startTime: %s', taskId, myStartTime);
				return;
			} else if (aStartTime === myStartTime && taskId > aTaskId) {
				log.warning('Both tasks have the same startTime (%s). Aborting the task with largest taskId: %s', myStartTime, taskId);
				return;
			}
		}
	} // for
	DEBUG_MODE && log.info('Task with id %s is allowed to run :)', taskId);
} // run
