# Personal pages

This are the sources of my personal web page at [https://moquet.net](https://moquet.net),
powered by Sculpin.

## Contributing

Generate for local development (both commands are "watching"):

```
$ gulp
$ sculpin generate --watch --server
```

Generate for prod environment (see [gh-pages script](./gh-pages.sh)):

```
$ gulp icons
$ gulp build --prod
$ sculpin generate --env=prod
```
