import {
	describe,
	expect,
	// jest,
	test
} from '@jest/globals';
import { ContentSecurityPolicy } from '../../../src/main/resources/lib/csp';
import Log from '@enonic/mock-xp/dist/Log';

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.log = Log.createLogger({
	loglevel: 'error'
});

describe('lib', () => {
	describe('csp', () => {
		describe('parse', () => {
			test('CSP2', () => {
				const validCsp = // Test policy with different features from CSP2.
					'default-src \'none\';' +
					'script-src \'nonce-unsafefoobar\' \'unsafe-eval\'   \'unsafe-inline\' \n' +
					'https://example.com/foo.js foo.bar;      ' +
					'object-src \'none\';' +
					'img-src \'self\' https: data: blob:;' +
					'style-src \'self\' \'unsafe-inline\' \'sha256-1DCfk1NYWuHMfoobarfoobar=\';' +
					'font-src *;' +
					'child-src *.example.com:9090;' +
					'upgrade-insecure-requests;\n' +
					'report-uri /csp/test';
				const csp = ContentSecurityPolicy.parse(validCsp);
				expect(csp.directives).toStrictEqual({
					'default-src': [ "'none'" ],
					'script-src': [
						"'nonce-unsafefoobar'",
						"'unsafe-eval'",
						"'unsafe-inline'",
						'https://example.com/foo.js',
						'foo.bar'
					],
					'object-src': [ "'none'" ],
					'img-src': [ "'self'", 'https:', 'data:', 'blob:' ],
					'style-src': [ "'self'", "'unsafe-inline'", "'sha256-1DCfk1NYWuHMfoobarfoobar='" ],
					'font-src': [ '*' ],
					'child-src': [ '*.example.com:9090' ],
					'upgrade-insecure-requests': [],
					'report-uri': [ '/csp/test' ]
				});
				expect(csp.toString()).toBe("default-src 'none'; script-src 'nonce-unsafefoobar' 'unsafe-eval' 'unsafe-inline' https://example.com/foo.js foo.bar; object-src 'none'; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline' 'sha256-1DCfk1NYWuHMfoobarfoobar='; font-src *; child-src *.example.com:9090; upgrade-insecure-requests ; report-uri /csp/test");
			});

			test('handles duplicates', () => {
				const validCsp = 'default-src \'none\';' +
					'default-src foo.bar;' +
					'object-src \'none\';' +
					'OBJECT-src foo.bar;';
				const csp = ContentSecurityPolicy.parse(validCsp);
				expect(csp.directives).toStrictEqual({
					'default-src': [
						"'none'",
						'foo.bar',
					],
					'object-src': [
						"'none'",
						'foo.bar',
					],
				});
			});

			test('mixed case Keywords', () => {
				const validCsp = 'DEFAULT-src \'NONE\';' + // Keywords should be case insensetive.
					'img-src \'sElf\' HTTPS: Example.com/CaseSensitive;';
					const csp = ContentSecurityPolicy.parse(validCsp);
				expect(csp.directives).toStrictEqual({
					'default-src': [
						"'none'"
					],
					'img-src': [
						"'self'",
						'https:',
						'Example.com/CaseSensitive',
					],
				});
			});
		});
	});
});
