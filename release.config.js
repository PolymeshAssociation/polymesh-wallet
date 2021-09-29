/* eslint-disable no-multi-str */
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
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        prepareCmd: './bump-versions.sh ${nextRelease.version}'
        // publishCmd: './commit-versions.sh ${nextRelease.version}'
      }
    ],
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
