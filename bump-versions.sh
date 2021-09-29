yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd packages/core
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../extension
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../ui
yarn version --no-git-tag-version --no-commit-hooks --new-version ${1}
cd ../..
yarn build