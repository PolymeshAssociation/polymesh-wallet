// Copyright 2017-2024 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import baseConfig from './eslint-custom-config.js';

export default [
  ...baseConfig,
  {
    ignores: [
      '**/.github/',
      '**/.vscode/',
      '**/.yarn/',
      '**/build/',
      '**/build-*/',
      '**/coverage/',
      'release.config.cjs',
      '.eslintrc.js',
      'jest.config.js',
      'jest.e2e.config.js',
      '**/build/*',
      '**/coverage/*',
      '**/node_modules/*',
      '__tests__',
      '**/*.test.ts'
    ]
  },
  {
    rules:
     {
       'header/header': 'off',
       'import/export': 'off',
       'import/extensions': 'off',
       'import/no-extraneous-dependencies': ['error', { packageDir: ['./', './packages/core', './packages/extension', './packages/ui'] }]
     }
  }
];
