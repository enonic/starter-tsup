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
	DEBUG_MODE && log.info('Hello from transpiled typescript testRepoConnectionQuery task :)');
	DEBUG_MODE && log.info('config:%s', toStr(config));
	DEBUG_MODE && log.info('taskId:%s', taskId);

	const task = getTask(taskId);
	DEBUG_MODE && log.info('task:%s', toStr(task));

	const {
		startTime: myStartTime,
		name: myTaskName
	} = task;

	const taskList = listTasks({
		// name: `${app.name}.test-task`,
		// state: 'RUNNING'
	});
	DEBUG_MODE && log.info('taskId:%s taskList:%s', taskId, toStr(taskList));

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
			DEBUG_MODE && log.info('Another task:%s with the same name:%s found taskId:%s', aTaskId, myTaskName, taskId);
			if (myStartTime > aStartTime) {
				log.warning('Another task:%s with the same name:%s found, aborting task:%s with newest startTime:%s', aTaskId, myTaskName, taskId, myStartTime);
				return;
			} else if (aStartTime === myStartTime && taskId > aTaskId) {
				log.warning('Another task:%s with the same name:%s, and the same startTime:%s found, aborting task:%s with largest taskId:%s', aTaskId, myStartTime, taskId);
				return;
			}
		}
	} // for
	DEBUG_MODE && log.info('Task with id:%s allowed to run :)', taskId);
} // run
