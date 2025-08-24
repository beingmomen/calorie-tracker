// apps/server/eslint.config.js
import base from '../../eslint.base.config.js';
import globals from 'globals';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier';

export default [
  ...base,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      n,
      prettier
    },
    rules: {
      // توصيات node
      ...n.configs['flat/recommended'].rules,

      // تخصيصاتك
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'consistent-return': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'class-methods-use-this': 'off',
      'no-await-in-loop': 'off',
      'func-names': 'off',
      'no-continue': 'off',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val|err' }]
    }
  }
];
