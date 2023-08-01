import "./App.sass";


import { toStr } from '@enonic/js-utils';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';


export function App() {
	const id = useId();
	console.debug(`Hello from App.tsx. React app id: ${toStr({id})}`);
	return (
		<>
			<div className="appbar">
				<div className="home-button app-icon system-info-button">
					<img alt="Application Icon" className="app-icon"/>
					<span className="app-name">Sample Tool</span>
				</div>
			</div>
			<div className="admin-tool-container">
				<h3 className="darkgray">This is a sample Admin Tool. Note the XP menu icon in the top right corner.</h3>
				<br/>
				<h5 className="lightgray">Hello from Day.js! Current time is: {dayjs().format('DD.MM.YYYY HH:MM:ss')}</h5>
			</div>
		</>
	);
}
