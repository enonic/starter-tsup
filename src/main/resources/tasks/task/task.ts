import type {TaskInfo} from '/lib/xp/task';

import {
	arrayIncludes,
	PRINCIPAL_ROLE_SYSTEM_ADMIN, TASK_STATE_RUNNING, TASK_STATE_WAITING,
	toStr
} from '@enonic/js-utils';
import {
	createVirtualApplication,
} from '/lib/xp/app';
import {run as runInContext} from '/lib/xp/context';
import {
	create as createProject
} from '/lib/xp/project';
import {
	createSchema,
	listSchemas,
} from '/lib/xp/schema';
import {DEBUG_MODE} from "/constants";
import {get as getTask, list as listTasks} from '/lib/xp/task';


const APP_KEY_VIRTUAL = `${app.name}.virtual` as const;
const BRANCH_MASTER = 'master';
const CONTENT_TYPE = `${APP_KEY_VIRTUAL}:test` as const;
const PROJECT_ID = app.name.replace('com.enonic.app.', '').replace(/\./g, '-');
const SCHEMA_TYPE = 'CONTENT_TYPE';

const duplicateTaskFound = (taskId: string) => {
	const task: TaskInfo = getTask(taskId) as TaskInfo;
	DEBUG_MODE && log.info('Task details (lib-task.get): %s', toStr(task));

	const {
		startTime: myStartTime,
		name: myTaskName
	} = task;

	const taskList = listTasks({});
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
				log.warning('Aborting task %s with newer startTime: %s', taskId, myStartTime);
				return true;
			} else if (aStartTime === myStartTime && taskId > aTaskId) {
				log.warning('Both tasks have the same startTime (%s). Aborting the task with largest taskId: %s', myStartTime, taskId);
				return true;
			}
		}
	} // for
	DEBUG_MODE && log.info('Task with id %s is allowed to run :)', taskId);

	return false;
}

interface EnonicException {
	class: {
		name:string
	}
	message: string
}

const createVirtualApp = () => {
	try {
		DEBUG_MODE && log.info('Trying to create a virtual app (lib-app.createVirtualApplication) with key "%s"', APP_KEY_VIRTUAL);
		const virtualApp = createVirtualApplication({
			key: APP_KEY_VIRTUAL
		});
		DEBUG_MODE && log.info('Virtual app  successfully created: %s', toStr(virtualApp));
	} catch (e) {
		if ((e as EnonicException).class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
			log.error(`e.class.name:${toStr((e as EnonicException).class.name)} e.message:${toStr((e as EnonicException).message)}`, e);
		} else {
			log.info('Virtual app "%s" already exists', APP_KEY_VIRTUAL)
		}
	} // try/catch*/
}

const createSampleProject = () => {
	try {
		DEBUG_MODE && log.info('Trying to create a project (lib-project.create) with Id "%s"', PROJECT_ID);
		const createdProject = createProject({
			displayName: 'XP Starter',
			id: PROJECT_ID,
			readAccess: {
				public: true
			},
			siteConfig: [{
				applicationKey: APP_KEY_VIRTUAL,
				config: {}
			}],
		});
		DEBUG_MODE && log.info('Project successfully created: %s', toStr(createdProject));
	} catch (e) {
		if ((e as EnonicException).class.name !== 'com.enonic.xp.core.impl.project.ProjectAlreadyExistsException') {
			log.error(`e.class.name:${toStr((e as EnonicException).class.name)} e.message:${toStr((e as EnonicException).message)}`, e);
		} else {
			log.info('Project "%s" already exists', PROJECT_ID)
		}
	} // try/catch
}

const createVirtualContentType = () => {
	try {
		DEBUG_MODE && log.info('Trying to create a dynamic content type (lib-schema.createSchema) "%s"', CONTENT_TYPE);
		const createdSchema = createSchema({
			name: CONTENT_TYPE,
			type: SCHEMA_TYPE,
			resource: `<content-type>
	<description>Virtual content type description</description>
	<display-name>Virtual content type</display-name>
	<super-type>base:structured</super-type>
	<is-abstract>false</is-abstract>
	<is-final>true</is-final>
	<is-built-in>false</is-built-in>
	<allow-child-content>true</allow-child-content>
	<form/>
</content-type>`,
		});
		DEBUG_MODE && log.info('Content type successfully created: %s', toStr(createdSchema));

		const schemas = listSchemas({application: `${app.name}`, type: SCHEMA_TYPE} )
		DEBUG_MODE && log.info('List of all descriptors with type "%s" (lib.schema.listSchemas): %s', SCHEMA_TYPE, toStr(schemas));
	} catch (e) {
		if ((e as EnonicException).class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
			log.error(`e.class.name:${toStr((e as EnonicException).class.name)} e.message:${toStr((e as EnonicException).message)}`, e);
		} else {
			log.info('Content type "%s" already exists', CONTENT_TYPE)
		}
	} // try/catch
}

const getContext = () => {
	return {
		repository: 'system-repo',
		branch: BRANCH_MASTER,
		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	};
}

export function run(config: Record<string, unknown>, taskId: string) {
	DEBUG_MODE && log.info('Submitting "tasks/task/task.ts" with config %s', toStr(config));

	if (duplicateTaskFound(taskId)) {
		return;
	}

	runInContext(getContext(), () => {

		createVirtualApp();
		createSampleProject();
		createVirtualContentType();

	}) // runInContext
} // run
