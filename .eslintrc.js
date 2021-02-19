const base = require('@polkadot/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*',
    '**/uidCrypto/*',
    'packages/ui/src/assets/images/icons/generated/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off',
    'header/header': 'off',
    'sort-keys': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    // @FIXME we need to take these seriously
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    'multiline-ternary': 'warn',
    'simple-import-sort/imports': [2, {
      groups: [
        ['^\u0000'], // all side-effects (0 at start)
        ['\u0000$', '^@@polymathnetwork.*\u0000$', '^\\..*\u0000$'], // types (0 at end)
        ['^[^/\\.]'], // non-@polymathnetwork
        ['^@@polymathnetwork'], // @polymathnetwork
        ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
      ]
    }]
  }
};