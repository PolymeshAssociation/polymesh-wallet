npm version --workspaces ${1}
npm version --no-git-tag-version --allow-same-version ${1}
yarn build
git add .
git commit -am "chore(release): update package versions ${1} [skip ci]"
git push