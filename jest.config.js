module.exports = {
	collectCoverageFrom: [
		'src/main/resources/**/*.{ts,tsx}'
	],
	coverageProvider: 'v8',
	preset: 'ts-jest/presets/js-with-babel-legacy',
	testEnvironment: 'node',
};
