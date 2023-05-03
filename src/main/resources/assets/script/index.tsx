import dayjs from 'dayjs';
import React from 'react';
import { useId } from 'react';


export function App() {
	const id = useId();
	console.debug(id);
	return (<div>{dayjs().format()}</div>);
}
