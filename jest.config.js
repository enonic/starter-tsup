module.exports = {
	collectCoverageFrom: [
		'src/main/resources/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
	],
	coverageProvider: 'v8',
	preset: 'ts-jest/presets/js-with-babel-legacy',
	testEnvironment: 'node',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					sourceMap: true, // Needed to get correct Uncovered Line numbers
				}
			}
		]
	},
};
