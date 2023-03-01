git pull

yarn workspace @polymeshassociation/extension-core version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymeshassociation/extension-ui version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymeshassociation/extension version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymeshassociation/extension add @polymeshassociation/extension-core@${1} @polymeshassociation/extension-ui@${1} 

yarn build

git add -A
git commit -m "chore(release): update package versions to ${1} [skip ci]"
git push