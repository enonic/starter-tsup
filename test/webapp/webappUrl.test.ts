import {
	describe,
	expect,
	jest,
	test
} from '@jest/globals';
import webappUrl from '../../src/main/resources/webapp/webappUrl';
import {VHOST_LIST} from './testData';
import Log from '@enonic/mock-xp/dist/Log';


// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.app = {
	name: 'com.acme.example.tsup'
}

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.log = Log.createLogger({
	loglevel: 'warn'
});

jest.mock('/lib/xp/vhost', () => ({
	__esModule: true,
	isEnabled: () => false,
	list: () => ({
		vhosts: VHOST_LIST
	}),
}), { virtual: true });

describe('webappUrl', () => {
	test('it works with vhost disabled', () => {
		expect(webappUrl('filename.ext')).toBe('/webapp/com.acme.example.tsup/filename.ext');
	});
	test('it works without path and vhost enabled', () => {
		expect(webappUrl()).toBe('/webapp/com.acme.example.tsup');
	});
});
