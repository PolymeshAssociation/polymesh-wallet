git reset --soft HEAD~2
git commit -am 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
git push