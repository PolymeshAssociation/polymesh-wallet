git pull origin $(git rev-parse --abbrev-ref HEAD)

yarn workspace @polymathnetwork/extension-core version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension-ui version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension version --no-git-tag-version --no-commit-hooks --new-version ${1}
yarn workspace @polymathnetwork/extension add @polymathnetwork/extension-core@${1} @polymathnetwork/extension-ui@${1} 

yarn build

git add .
git commit -am "chore(release): update package versions ${1} [skip ci]"
git push