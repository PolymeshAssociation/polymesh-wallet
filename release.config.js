module.exports = {
  branches: [
    'master',
    {
      name: 'develop',
      prerelease: true
    },
    {
      name: 'semantic-release',
      prerelease: true
    }
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'master-build.zip',
            label: '${nextRelease.version}.zip' // eslint-disable-line no-template-curly-in-string
          }
        ]
      }
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}' // eslint-disable-line no-template-curly-in-string
      }
    ],
    ['@semantic-release/exec', { successCmd: 'yarn build' }]
  ]
};
