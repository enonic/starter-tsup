import "./Component.sass"

import { toStr } from '@enonic/js-utils';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';


export function App() {
	const id = useId();
	console.debug(toStr({id}));
	return (<div className='blue'>{dayjs().format()}</div>);
}
