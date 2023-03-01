/* eslint-disable sort-keys */
const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  browser: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!lodash-es)'
  ],
  // @FIXME ignoring UI tests until we write proper ones.
  testPathIgnorePatterns: ['packages/extension-ui/(.*)$'],
  moduleNameMapper: {
    '@polkadot/extension-(base|chains|dapp|inject|ui)(.*)$': '<rootDir>/packages/extension-$1/src/$2',
    '@polkadot/extension(.*)$': '<rootDir>/packages/extension/src/$1',
    '@polymath/extension(.*)$': '<rootDir>/packages/extension-polymath/src/$1',
    '@polymeshassociation/extension-ui(.*)$': '<rootDir>/packages/extension-polymath-ui/src/$1',
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/extension/build',
    '<rootDir>/packages/extension-base/build',
    '<rootDir>/packages/extension-chains/build',
    '<rootDir>/packages/extension-dapp/build',
    '<rootDir>/packages/extension-inject/build',
    '<rootDir>/packages/extension-ui/build'
  ]
};
