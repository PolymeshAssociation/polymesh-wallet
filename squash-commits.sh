git pull origin $(git rev-parse --abbrev-ref HEAD)
git reset --soft HEAD~2
git commit -am 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
git push