import {
	PRINCIPAL_ROLE_SYSTEM_ADMIN,
	toStr
} from '@enonic/js-utils';
import {
	createVirtualApplication,
} from '/lib/xp/app';
import {run as runInContext} from '/lib/xp/context';
import {
	create as createProject,
	delete as deleteProject
} from '/lib/xp/project';
import {
	createSchema,
	listSchemas,
} from '/lib/xp/schema';
import {DEBUG_MODE} from "/constants";


const APP_KEY_VIRTUAL = `${app.name}.virtual` as const;
const BRANCH_MASTER = 'master';
const CONTENT_TYPE = `${APP_KEY_VIRTUAL}:test` as const;
const PROJECT_ID = app.name.replace('com.enonic.app.', '').replace(/\./g, '-');
const SCHEMA_TYPE = 'CONTENT_TYPE';

export function run() {
	DEBUG_MODE && log.info('Submitting task from "tasks/testContentQuery/testContentQuery.ts"...');
	runInContext({
		repository: 'system-repo',
		branch: BRANCH_MASTER,
		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	}, () => {

		try {
			const vApp = createVirtualApplication({
				key: APP_KEY_VIRTUAL
			});
			DEBUG_MODE && log.info('Created a virtual app (lib-app.createVirtualApplication): %s', toStr(vApp));
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

		try {
			const createdSchema = createSchema({
				name: CONTENT_TYPE,
				type: SCHEMA_TYPE,
				resource: `<content-type>
	<description>Test description</description>
	<display-name>Test displayName</display-name>
	<super-type>base:structured</super-type>
	<is-abstract>false</is-abstract>
	<is-final>true</is-final>
	<is-built-in>false</is-built-in>
	<allow-child-content>true</allow-child-content>
	<form/>
</content-type>`,
			});
			DEBUG_MODE && log.info('Created a content type descriptor (lib-schema.createSchema): %s', toStr(createdSchema));

			const schemas = listSchemas({application: `${app.name}`, type: SCHEMA_TYPE} )
			DEBUG_MODE && log.info('List of all descriptors with type "%s" (lib.schema.listSchemas): %s', SCHEMA_TYPE, toStr(schemas));
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

		try {
			DEBUG_MODE && log.info('Trying to create a project (lib-project.create) with Id "%s"', PROJECT_ID);
			const createdProject = createProject({
				displayName: 'XP Starter',
				id: PROJECT_ID,
				readAccess: {
					public: true
				},
				siteConfig: {},
			});
			DEBUG_MODE && log.info('Project successfully created: %s', toStr(createdProject));
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.core.impl.project.ProjectAlreadyExistsException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

	}) // runInContext
} // run
