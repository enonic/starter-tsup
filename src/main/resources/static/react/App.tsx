/* eslint-disable react/prop-types */

import "./App.sass";

import { toStr } from '@enonic/js-utils/value/toStr';
import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';

export function App(props) {
	const id = useId();

	console.debug(`React app id: ${toStr({id})}`);

	return (
		<>
			<div className='container'>
				<div className='header'>
					<h3 className='message'>Current client-side date/time is:<br/> {dayjs().format('DD.MM.YYYY H:mm:ss [GMT]Z')}</h3>
				</div>
				<div className='body'>
					<h1 className='title'>{props.header}</h1>
					<h3 className='message'>{props.message}</h3>
				</div>
			</div>
		</>
	);
}
