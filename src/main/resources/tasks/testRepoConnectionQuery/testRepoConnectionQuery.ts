import {
	// PRINCIPAL_ROLE_SYSTEM_ADMIN,
	TASK_STATE_RUNNING,
	TASK_STATE_WAITING,
	arrayIncludes,
	// toStr
} from '@enonic/js-utils';
// import {run as runInContext} from '/lib/xp/context';
// import {
// 	connect,
// 	Aggregations
// } from '/lib/xp/node';
// import {create as createRepo} from '/lib/xp/repo';
import {
	get as getTask,
	list as listTasks,
} from '/lib/xp/task';


const BRANCH_MASTER = 'master';
const REPO_ID = `${app.name}.test`;
const NAME_ONE = 'Name One';
const NAME_TWO = 'Name Two';


export function run(config, taskId) {
	// log.info('Hello from transpiled typescript testRepoConnectionQuery task :)');
	// log.info('config:%s', toStr(config));
	// log.info('taskId:%s', taskId);

	const task = getTask(taskId);
	// log.info('task:%s', toStr(task));
	const {
		startTime: myStartTime,
		name: myTaskName
	} = task;

	const taskList = listTasks({
		// name: 'com.acme.example.tsup', // a startsWith or regexp filter would be better
		// state: 'RUNNING' // Filter on a list of states would be nice.
	});
	//log.info('taskId:%s taskList:%s', taskId, toStr(taskList));

	for (let index = 0; index < taskList.length; index++) {
		const {state} = taskList[index];
		if (!arrayIncludes([TASK_STATE_RUNNING,TASK_STATE_WAITING],state)) {
			continue;
		}
		const {
			// application,
			id: aTaskId,
			name: aTaskName,
			startTime: aStartTime,
		} = taskList[index];
		if (aTaskName === myTaskName && aTaskId !== taskId) {
			log.info('Another task:%s with the same name:%s found taskId:%s', aTaskId, myTaskName, taskId);
			if (myStartTime > aStartTime) {
				log.warning('Another task:%s with the same name:%s found, aborting task:%s with newest startTime:%s', aTaskId, myTaskName, taskId, myStartTime);
				return;
			} else if (aStartTime === myStartTime && taskId > aTaskId) {
				log.warning('Another task:%s with the same name:%s, and the same startTime:%s found, aborting task:%s with largest taskId:%s', aTaskId, myStartTime, taskId);
				return;
			}
		}
	} // for
	log.info('Task with id:%s allowed to run :)', taskId);

	// runInContext({
	// 	repository: 'system-repo',
	// 	branch: BRANCH_MASTER,
	// 	principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	// }, () => {

	// 	try {
	// 		createRepo({
	// 			id: REPO_ID
	// 		});
	// 	} catch (e) {
	// 		if (e.class.name !== 'com.enonic.xp.repo.impl.repository.RepositoryAlreadyExistException') {
	// 			log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
	// 		}
	// 	} // try/catch

	// 	const writeConnection = connect({
	// 		branch: BRANCH_MASTER,
	// 		repoId: REPO_ID,
	// 		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	// 	});

	// 	try {
	// 		writeConnection.create({
	// 			_name: NAME_ONE
	// 		});
	// 	} catch (e) {
	// 		if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
	// 			log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
	// 		}
	// 	} // try/catch

	// 	try {
	// 		writeConnection.create({
	// 			_name: NAME_TWO
	// 		});
	// 	} catch (e) {
	// 		if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
	// 			log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
	// 		}
	// 	} // try/catch

	// 	writeConnection.refresh();

	// 	const aggregations = {
	// 		'nodetypeAggregation': {
	// 			terms: {
	// 				field: '_nodeType'
	// 			},
	// 			aggregations: {
	// 				'nodetypeNameAggregation': {
	// 					terms: {
	// 						field: '_name'
	// 					}
	// 				}
	// 			}
	// 		}
	// 	} satisfies Aggregations;

	// 	const queryRes = writeConnection.query({
	// 		aggregations,
	// 		count: -1,
	// 		query: {
	// 			matchAll: {}
	// 		}
	// 	});
	// 	log.info('queryRes:%s', toStr(queryRes));
	// 	const {
	// 		nodetypeAggregation: {
	// 			buckets
	// 		}
	// 	} = queryRes.aggregations;
	// 	for (let index = 0; index < buckets.length; index++) {
	// 		const element = buckets[index];
	// 		const {
	// 			docCount,
	// 			key,
	// 			from,
	// 			to,
	// 		} = element;
	// 		// if (isDateRange(element)) {

	// 		// } else if (isNumericRange(element)) {

	// 		// }
	// 	}

	// }) // runInContext
} // run
