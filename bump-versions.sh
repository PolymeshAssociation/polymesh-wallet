git pull origin $(git rev-parse --abbrev-ref HEAD)

yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd packages/core
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../extension
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../ui
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../..
yarn build

git add .
git commit -am "chore(release): update package versions ${1} [skip ci]"
git push