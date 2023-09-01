import {
	describe,
	expect,
	jest,
	test
} from '@jest/globals';
import { getBaseWebappUrl } from '../../src/main/resources/lib/urlHelper';
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

jest.mock('../../src/main/resources/lib/ioResource', () => ({
	__esModule: true,
	default: jest.fn((filename: string) => ''),
}), { virtual: true });

jest.mock('../../src/main/resources/lib/runMode', () => ({
	__esModule: true,
	IS_DEV_MODE: jest.fn(() => false),
}), { virtual: true });

jest.mock('/lib/enonic/static', () => ({
	__esModule: true,
	buildGetter: jest.fn(() => {})
}), { virtual: true });

jest.mock('/lib/xp/vhost', () => ({
	__esModule: true,
	isEnabled: () => false,
	list: () => ({
		vhosts: VHOST_LIST
	}),
}), { virtual: true });

jest.mock('/lib/xp/portal', () => ({
	__esModule: true,
	getSite: () => jest.fn(),
	pageUrl: () => jest.fn(),
}), { virtual: true });

jest.mock('/lib/xp/admin', () => ({
	__esModule: true,
	getToolUrl: () => jest.fn(() => 'tool/com.my.app/mytool'),
}), { virtual: true });

describe('webappUrl', () => {
	test('it works with vhost disabled', () => {
		expect(getBaseWebappUrl('filename.ext')).toBe('/webapp/com.acme.example.tsup/filename.ext');
	});
	test('it works without path and vhost enabled', () => {
		expect(getBaseWebappUrl()).toBe('/webapp/com.acme.example.tsup');
	});
});
