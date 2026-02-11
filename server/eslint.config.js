
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import js from '@eslint/js';

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {},
  },

  prettier,
];
