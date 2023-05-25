import {
	describe,
	expect,
	jest,
	test
} from '@jest/globals';
import webappUrl from '../../src/main/resources/webapp/webappUrl';
import {VHOST_LIST} from './testData';


// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.app = {
	name: 'com.acme.example.tsup'
}

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.log = {
	info: () => {}
	// info: console.info
};


jest.mock<typeof import('@enonic-types/lib-vhost')>('/lib/xp/vhost', () => ({
	__esModule: true,
	isEnabled: jest.fn(() => true),
	list: () => ({
		vhosts: VHOST_LIST
	}),
}), { virtual: true });

describe('webappUrl', () => {
	test('it works with vhost enabled', () => {
		expect(webappUrl('filename.ext')).toBe('/webapp/filename.ext');
	});
	test('it works without path and vhost enabled', () => {
		expect(webappUrl()).toBe('/webapp');
	});
});
