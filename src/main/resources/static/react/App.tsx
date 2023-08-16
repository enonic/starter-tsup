import "./App.sass";

import { toStr } from '@enonic/js-utils';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';


export function App() {
	const id = useId();
	console.debug(`Hello from React inside a site page. React app id: ${toStr({id})}`);

	return (
		<>
			<div className='blue'>{dayjs().format()}
				<h3>This is a React app inside a site page.</h3>
				<br/>
				<h5>Hello from Day.js! Current date/time is: {dayjs().format('DD.MM.YYYY H:mm:ss [GMT]Z')}</h5>
			</div>
		</>
	);
}
