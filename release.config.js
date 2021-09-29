/* eslint-disable no-template-curly-in-string */

module.exports = {
  branches: [
    'master',
    {
      name: 'develop',
      prerelease: true
    },
    'semantic-release'
  ],
  tagFormat: '${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    // '@semantic-release/npm',
    ['@semantic-release/exec', { prepareCmd: 'npm version --workspaces ${nextRelease.version} && npm version --no-git-tag-version ${nextRelease.version} && git commit -am "chore(release): update package versions ${nextRelease.version} [skip ci]" && yarn build' }],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'master-build.zip',
            label: '${nextRelease.version}.zip'
          }
        ],
        successComment: false,
        failComment: false
      }
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
};
