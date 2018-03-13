#!/bin/sh

cwd=$(pwd)
tag="exercise-$1"

mkdir -p /tmp/from-source-to-production-with-ease
cd /tmp/from-source-to-production-with-ease
[ -d .git ] || git clone ~/Dropbox/Dev/from-source-to-production-with-ease . 2>&1 >/dev/null
git checkout --force tags/$tag 2>&1 >/dev/null
rsync -avP \
      --exclude="exercise.sh" \
      ./exercise/ \
      $cwd 2>&1 >/dev/null

cd $cwd