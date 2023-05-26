import "./App.sass";


import { toStr } from '@enonic/js-utils';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';


export function App() {
	const id = useId();
	console.debug(toStr({id}));
	return (
		<>
			<div className="appbar">
				<div className="home-button app-icon system-info-button">
					<img alt="Application Icon" className="app-icon"/>
					<span className="app-name">Admin tool starter</span>
				</div>
			</div>
			<div className='blue'>{dayjs().format()}</div>
		</>
	);
}
