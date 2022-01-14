#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

# Removes files (prevent override)
# https://askubuntu.com/questions/269775/mv-directory-not-empty
rm -rf /app/templates/*
rm -rf /app/static/*

# Build
npm run build # or npm run watch (rebuild on change)

# Move build files into specific directories that are shared with Django
mv /app/build/index.html /app/templates/index.html
mv /app/build/* /app/static/
