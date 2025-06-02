import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
	{
		ignores: ["build/**/*.*"],
	},
	{
		// Global settings for all files
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	// TypeScript files configuration
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'react': pluginReact,
			'jsx-a11y': pluginJsxA11y,
			'react-hooks': pluginReactHooks,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node, // Or other environments if needed
			},
		},
		rules: {
			...pluginReact.configs.recommended.rules,
			...pluginJsxA11y.configs.recommended.rules,
			...pluginReactHooks.configs.recommended.rules,
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	}
];
