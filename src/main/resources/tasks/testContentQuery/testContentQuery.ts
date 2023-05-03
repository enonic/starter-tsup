import {
	PRINCIPAL_ROLE_SYSTEM_ADMIN,
	toStr
} from '@enonic/js-utils';
import {
	createVirtualApplication,
	// get as getApp,
	// getApplicationMode,
	// list as listApps
} from '/lib/xp/app';
import {run as runInContext} from '/lib/xp/context';
import {
	create as createProject,
	delete as deleteProject
} from '/lib/xp/project';
import {
	createSchema,
	// listSchemas,
} from '/lib/xp/schema';


const APP_KEY_VIRTUAL = `${app.name}.virtual` as const;
const BRANCH_DRAFT = 'draft';
const BRANCH_MASTER = 'master';
const CONTENT_TYPE = `${app.name}:test` as const;
const PROJECT_ID = app.name.replace('com.enonic.app.', '').replace(/\./g, '-');
const REPO_ID = `com.enonic.cms.${PROJECT_ID}` as const;


export function run() {
	log.info('Hello from transpiled typescript testContentQuery task :)');
	runInContext({
		repository: 'system-repo',
		branch: BRANCH_MASTER,
		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	}, () => {

		try {
			const vApp = createVirtualApplication({
				key: APP_KEY_VIRTUAL
			});
			log.info('vApp:%s', toStr(vApp));
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

		try {
			const createdSchema = createSchema({
				name: CONTENT_TYPE,
				type: 'CONTENT_TYPE',
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
			log.info('createdSchema:%s', createdSchema);
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

		try {
			deleteProject({
				id: PROJECT_ID,
			});
		} catch (e) {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
		} // try/catch

		try {
			createProject({
				displayName: 'Content Tests',
				id: PROJECT_ID,
				readAccess: {
					public: true
				},
				siteConfig: {},
			});
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.core.impl.project.ProjectAlreadyExistsException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try/catch

	}) // runInContext
} // run
