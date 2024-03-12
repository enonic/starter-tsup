import { blue, bold, green } from "colorette"
import { exec } from 'node:child_process';
import { createMonitor } from 'watch';
import { extname } from 'path';
import {
	DIR_SRC,
	DIR_SRC_ASSETS,
	DIR_SRC_STATIC
} from './constants';


const OPTIONS = {
	ignoreDotFiles: false, // When true this option means that when the file tree is walked it will ignore files that being with "."

	// You can use this option to provide a function that returns true or false for each file and directory to decide whether or not that file/directory is included in the watcher.
	// filter: (path, stat) => {
	// 	console.log('filter', path, stat);
	// 	return true;
	// },

	interval: 2, // Specifies the interval duration in seconds, the time period between polling for file changes.
	ignoreUnreadableDir: false, // When true, this options means that when a file can't be read, this file is silently skipped.
	ignoreNotPermitted: false, // When true, this options means that when a file can't be read due to permission issues, this file is silently skipped.
	// ignoreDirectoryPattern: /node_modules/, // When a regex pattern is set, e.g. /node_modules/, these directories are silently skipped.
};


function shouleBeWatched(f: string) {
	const ext = extname(f);
	return (
		ext === '.ts'
		|| ext === '.js'
	)
	&& !f.endsWith('.d.ts')
	&& !f.startsWith(DIR_SRC_ASSETS)
	&& !f.startsWith(DIR_SRC_STATIC);
}


function startChildProcess() {
	const childProcess = exec(
		'npm run watchChanges:server',
		{
			maxBuffer: undefined // unlimited
		},
		(error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`); // Never seen this
				return;
			}
			console.log(`stdout: ${stdout}`); // Never seen this
			console.error(`stderr: ${stderr}`); // Never seen this
		}
	);
	childProcess.stdout?.on('data', (data) => {
		console.log(data); // Works :)
	});
	childProcess.stderr?.on('data', (data) => {
		console.error(data);
	});
	return childProcess;
}

let childProcess = startChildProcess();

createMonitor(DIR_SRC, OPTIONS, (monitor) => {
	monitor.on("created", function (f, _stat) {
		if (
			shouleBeWatched(f)
		) {
			console.log(blue('WATCH'), 'New file detected', bold(f), 'restarting watch', green(':)'));
			childProcess.kill();
			childProcess = startChildProcess();
		}
	});

	monitor.on("removed", function (f, _stat) {
		if (
			shouleBeWatched(f)
		) {
			console.log(blue('WATCH'), 'File removed', bold(f), 'restarting watch', green(':)'));
			childProcess.kill();
			childProcess = startChildProcess();
		}
	})
});
