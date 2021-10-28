git pull

yarn workspace @polymathnetwork/extension-core version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension-ui version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension add @polymathnetwork/extension-core@${1} @polymathnetwork/extension-ui@${1} 

yarn build

git add -A
git commit -m "chore(release): update package versions to ${1} [skip ci]"
git push