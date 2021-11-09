module.exports = {
  branches: ['master', 'develop'],
  tagFormat: '${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      { prepareCmd: './.github/bump-versions.sh ${nextRelease.version}' },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'master-build.zip',
            label: '${nextRelease.version}.zip',
          },
        ],
        successComment: false,
        failComment: false,
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
        message:
          'chore(release): add changelog entry for version ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
