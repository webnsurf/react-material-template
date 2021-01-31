module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-import', 'react-hooks'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'airbnb',
    'prettier',
  ],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always-and-inside-groups',
        // alphabetize: { order: 'asc' },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',

    'jsx-a11y/label-has-associated-control': 'off',

    'react/jsx-fragments': [1, 'element'],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: false }],
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],

    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'consistent-return': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'react/no-unescaped-entities': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['source'],
      },
    },
  },
  globals: {
    JSX: 'readonly',
  },
};
