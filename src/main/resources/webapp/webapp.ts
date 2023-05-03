// import type {Request} from '@enonic/js-utils/types/Request';


// import {toStr} from '@enonic/js-utils';
// @ts-ignore
import Router from '/lib/router';
import etagGetter from './etagGetter';


const router = Router();

router.all('/static/{path:.+}', (r: Request) => {
	// log.info('Request:%s', toStr(r));
	return etagGetter(r);
});


export const all = (r: Request) => router.dispatch(r);
