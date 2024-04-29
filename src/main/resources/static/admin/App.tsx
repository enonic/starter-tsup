import "./App.sass";


import { toStr } from '@enonic/js-utils/value/toStr';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';

export function App() {
	const id = useId();
	console.debug(`Hello from React component inside an Admin Tool. React app id: ${toStr({id})}`);
	return (
		<>
			<div className="appbar">
				<div className="home-button app-icon">
					<span className="app-name">Sample Tool</span>
				</div>
			</div>
			<div className="admin-tool-container">
				<h3 className="darkgray">This is a React app inside an Admin Tool. Note the XP menu icon in the top right corner.</h3>
				<br/>
				<h5 className="lightgray">Hello from Day.js! Current date/time is: {dayjs().format('DD.MM.YYYY H:mm:ss [GMT]Z')}</h5>
			</div>
		</>
	);
}
