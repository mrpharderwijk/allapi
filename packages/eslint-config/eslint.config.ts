import type { Linter } from 'eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import js from '@eslint/js';

const customGlobals = {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
};

export default [
  js.configs.recommended,
  customGlobals,
  eslintConfigPrettier,
  {
    plugins: {
      prettier,
      // '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      endOfLine: 'off',
      'no-console': [0],
      'no-unused-vars': 'off',

      /**
       * https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
       */
      // '@typescript-eslint/explicit-function-return-type': 'warn',

      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          tabWidth: 2,
          useTabs: false,
          semi: false,
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],

      /**
       * https://github.com/sweepline/eslint-plugin-unused-imports
       */
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /**
       * https://github.com/lydell/eslint-plugin-simple-import-sort
       */
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\w', '^@\\w'], // external deps
            ['^\\.\\./', '^\\./'], // local dependencies
            ['^\\./(.*)module.scss$'], // css always last
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
] satisfies Linter.Config[];
