#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if a version argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION=${1}

echo "Updating to version $VERSION"

git pull

yarn workspace @polymeshassociation/extension-core version "$VERSION"
yarn workspace @polymeshassociation/extension-ui version "$VERSION"
yarn workspace @polymeshassociation/extension version "$VERSION"

yarn workspace @polymeshassociation/extension add @polymeshassociation/extension-core@"$VERSION" @polymeshassociation/extension-ui@"$VERSION"

yarn build

git add -A
git commit -m "chore(release): update package versions to $VERSION [skip ci]"
git push
