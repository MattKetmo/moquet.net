#!/bin/bash

# Update gh-pages branch
git branch -D gh-pages
git checkout -b gh-pages HEAD

# Clean folder
rm -rf output_prod

# Compile assets
gulp icons
gulp build --prod

# Build website
sculpin generate --env=prod

# Commit
git add -f output_prod
git commit -m "Build GH pages"

# Push & reset
git push origin `git subtree split --prefix output_prod HEAD`:gh-pages --force
git checkout -
