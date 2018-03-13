#!/bin/sh

cwd=$(pwd)
tag="exercise-$1"

mkdir -p /tmp/from-source-to-production-with-ease
cd /tmp/from-source-to-production-with-ease
if [ -d .git ]; then
  if [ $(git symbolic-ref --short -q HEAD) != "master" ]; then
    git -c advice.statusHints=false checkout --quiet --force master 2>&1 >/dev/null
  fi;
  git tag -l | xargs git tag -d 2>&1 >/dev/null
  git fetch --quiet --tags 2>&1 >/dev/null
  git fetch --quiet origin 2>&1 >/dev/null
  git reset --quiet --hard origin/master 2>&1 >/dev/null
else
  git clone ~/Dropbox/Dev/from-source-to-production-with-ease . 2>&1 >/dev/null
fi;
git -c advice.detachedHead=false reset --quiet --hard tags/$tag >/dev/null
rsync -avP \
      --exclude="exercise.sh" \
      ./exercise/ \
      $cwd 2>&1 >/dev/null

cd $cwd