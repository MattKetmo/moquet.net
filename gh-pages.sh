#!/bin/bash

#git config user.name "Matthieu Moquet"
#git config user.email "matthieu@moquet.net"

# Update gh-pages branch
git branch -D gh-pages
git checkout -b gh-pages master

# Compile assets
gulp icons
gulp build --prod
git add -f assets/dist
git commit -m "Build GH pages"

# Push & reset
git push -f origin gh-pages
git checkout master
