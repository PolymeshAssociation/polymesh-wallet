git pull origin $(git rev-parse --abbrev-ref HEAD)
git add .
git commit -am "chore(release): update package versions ${1} [skip ci]"
git push