module.exports = {
  root: true,
  env: {
    node: true,
    es2023: true
  },
  extends: ['airbnb-base', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
        tabWidth: 2,
        semi: true,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
        endOfLine: 'auto'
      }
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'req|res|next|val|err'
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'consistent-return': 'off',
    'no-process-exit': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'no-await-in-loop': 'off',
    'func-names': 'off',
    'no-continue': 'off',
    'prefer-destructuring': [
      'error',
      {
        object: true,
        array: false
      }
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id']
      }
    ],
    'import/no-unresolved': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never'
      }
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs']
      }
    }
  }
};
