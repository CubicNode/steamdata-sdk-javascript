// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tsEslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import { includeIgnoreFile } from '@eslint/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslint.config(
  includeIgnoreFile(path.resolve(__dirname, '.gitignore')),
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tsEslint.parser } } },
  stylistic.configs.customize({
    flat: true,
    semi: true,
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    languageOptions: {
      globals: {
        definePage: 'readonly',
      },
    },
  },
  {
    rules: {
      'no-useless-computed-key': ['error'],
      'no-console': ['warn'],
      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
      '@stylistic/function-call-spacing': ['error'],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['src/*'],
        },
      ],
    },
  },
);
