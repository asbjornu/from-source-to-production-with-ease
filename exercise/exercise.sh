#!/bin/sh

cwd=$(pwd)
tag="exercise-$1"

mkdir -p /tmp/from-source-to-production-with-ease
cd /tmp/from-source-to-production-with-ease
if [ -d .git ]; then
  if [ $(git symbolic-ref --short -q HEAD) != "master" ]; then
    git -c advice.statusHints=false checkout --force master 2>&1 >/dev/null
  fi;
  git pull 2>&1 >/dev/null
else
  git clone ~/Dropbox/Dev/from-source-to-production-with-ease . 2>&1 >/dev/null
fi;
git -c advice.detachedHead=false reset --hard tags/$tag >/dev/null
rsync -avP \
      --exclude="exercise.sh" \
      ./exercise/ \
      $cwd 2>&1 >/dev/null

cd $cwd