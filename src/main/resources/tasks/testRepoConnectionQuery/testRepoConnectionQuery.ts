import {
	PRINCIPAL_ROLE_SYSTEM_ADMIN,
	toStr
} from '@enonic/js-utils';
import {run as runInContext} from '/lib/xp/context';
import {
	connect,
	Aggregation
} from '/lib/xp/node';
import {create as createRepo} from '/lib/xp/repo';


const BRANCH_MASTER = 'master';
const REPO_ID = `${app.name}.test`;
const NAME_ONE = 'Name One';
const NAME_TWO = 'Name Two';


export function run() {
	log.info('Hello from transpiled typescript task :)');
	runInContext({
		repository: 'system-repo',
		branch: BRANCH_MASTER,
		principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
	}, () => {

		try {
			createRepo({
				id: REPO_ID
			});
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.repo.impl.repository.RepositoryAlreadyExistException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try...catch

		const writeConnection = connect({
			branch: BRANCH_MASTER,
			repoId: REPO_ID,
			principals: [PRINCIPAL_ROLE_SYSTEM_ADMIN]
		});

		try {
			writeConnection.create({
				_name: NAME_ONE
			});
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try...catch

		try {
			writeConnection.create({
				_name: NAME_TWO
			});
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		} // try...catch

		writeConnection.refresh();

		const aggregations = {
			'nodetypeAggregation': {
				terms: {
					field: '_nodeType'
				},
				aggregations: {
					'nodetypeNameAggregation': {
						terms: {
							field: '_name'
						}
					}
				}
			}
		} satisfies Record<string, Aggregation>;

		const queryRes = writeConnection.query<typeof aggregations>({
			aggregations,
			count: -1,
			query: {
				matchAll: {}
			}
		});
		log.info('queryRes:%s', toStr(queryRes));
		const {nodetypeAggregation} = queryRes.aggregations;

	}) // runInContext
} // run
