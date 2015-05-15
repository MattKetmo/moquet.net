---
layout: post
title: Proxify Composer for PHP
tags: [composer, php]
---

Every PHP developer who use modern libraries or frameworks should know
[Composer][]. Composer is a dependency manager for PHP which allows you to
declare the dependent libraries your project needs and it will install them in
your project for you.

Unlike system like PEAR, Composer is only "project-aware". This means your
dependencies must be installed for each of your project. This is essential
because your projects can depend on different version of a same library. In the
other hand it can be quite painful to download or git-clone many times all the
vendors from a (far far away) remote server. This is especially true when you:

- are working on **many projects** at the same time
- regulary `rm -rf vendor/` to be sure to **remove** the old dependencies (or
  because Composer just got a bug :))
- work on a project where everyone is using the same **local network** (that's
  true when you work in a company)

Since Composer approaches the date of the first stable version, the second
argument is becoming obsolete. Nevertheless, I want to focus on the last
point.

When you use a development version of a framework or library, you generally
want to get it from the sources. For instance, if you want to start a new
project with the 2.1 version of the [Symfony][] fullstack framework (for now,
`2.1.*` is an alias for `dev-master`), you have to git-clone the sources from
GitHub. From an European network, it takes quite long to fetch a repository
hosted on a US server:

    $ time git clone git://github.com/symfony/symfony.git
    Cloning into symfony...
    remote: Counting objects: 140968, done.
    remote: Compressing objects: 100% (43619/43619), done.
    remote: Total 140968 (delta 89494), reused 132229 (delta 81990)
    Receiving objects: 100% (140968/140968), 20.97 MiB | 198 KiB/s, done.
    Resolving deltas: 100% (89494/89494), done.

    real    2m15.30s
    user    0m1.47s
    sys     0m3.00s

More than 2 minutes is necessary to clone our main vendor (hopefully we don't
use SVN anymore). In addition to other libraries like [Doctrine][] or [Twig][],
the installation of all vendors could easily take 5 minutes or more. The
objective of this article would be to find a solution to install the same
vendors, in less than 15 seconds.

This would be really usefull to **save time and bandwidth** not only for the
developers, but also for CI systems ([Jenkins][]/[Travis][]), or PaaS solution
like [PagodaBox][] or [Heroku][] which run a `composer install` each time you
deploy a new code.

As Git is a decentralized system, it is relativly easy to create a proxy ---
ie. a local clone of the repository --- which everyone could use instead of the
original one.

## Using Gitpod

[Gitpod][] is a local caching server for Git. Its operation is very simple:
once you've cloned a repository, each time you git-fetch it, it will git-fetch
the original repository first. Thus, the first time will be as long as you if
you git-fetched the original repository, while the second will be
instantaneous.

The following example shows how I set up Gitpod to work with Composer.

According to the [documentation](https://github.com/sitaramc/gitpod#readme),
you first need to create a `gp` user on your `gp-server` (it could be your
localhost, or a different server on your local network), and copy or clone the
binaries into its home directory:

    # useradd gp
    # git clone git://github.com/sitaramc/gitpod.git /home/gp/bin

Then change its default shell:

    # chsh gp -s /home/gp/bin/gitpod

Now you can proxify any git repository from your shell by simply running:

    $ ssh gp@gp-server clone URL reponame

The result with the [Symfony repository](https://github.com/symfony/symfony):

    $ ssh gp@gp-server clone git://github.com/symfony/symfony.git symfony
    running: git clone --progress --mirror git://github.com/symfony/symfony.git
    Cloning into bare repository symfony.git...
    ...skipping cloning command...

    $ time git clone git://gp@gp-server/symfony.git
    Cloning into symfony-new...
    fetching from git://github.com/symfony/symfony.git
    remote: Counting objects: 141630, done.
    remote: Compressing objects: 100% (41715/41715), done.
    remote: Total 141630 (delta 89896), reused 135418 (delta 84468)
    Receiving objects: 100% (141630/141630), 21.11 MiB | 14.19 MiB/s, done.
    Resolving deltas: 100% (89896/89896), done.

    real    0m9.090s
    user    0m2.152s
    sys     0m1.776s

It takes less than 10 seconds to clone the Symfony sources into my local
computer (once I previously cloned it in Gitpod).

To use this git repository with into your project, just add the corresponding
repository section into your `composer.json`:

```json
{
    "require": {
        "symfony/symfony": "dev-master"
    },
    "repositories": [
        {
            "type": "vcs",
            "url":  "git://gp@gp-server/symfony.git"
        }
    ]
}
```

Now the `php composer.phar install` command will directly clone your local
repository instead of fetching GitHub.

Not to end up with lots of unmeaningful repositories in your `composer.json`,
you can use [Satis][] to reference all of your local proxies. Satis is usefull
when you want to declare private repositories for your project, but in this
case you can use it to **overload** any public repository with your proxy.
Then you only have to add the Satis URI in your `composer.json`:

```json
{
    "repositories": [
        {
            "type": "composer",
            "url": "http://packages.example.org/"
        }
    ],
    "require": {
        "symfony/symfony": "2.1.*"
    }
}
```

## Using Broker

I recently discovered [Broker][], a PHP application which creates a full
repository proxy for Composer.

Like the previous method, you have to initialize your proxy with the desired
vendors before running a `composer install` in your project. However Broker
has the advantage to directly take your `composer.json` as the reference, and
download all your vendors **as Composer do**. So it not only works for git
repositories, but also with archives (and everything Composer can manage).
Finally, it operates like Packagist or Satis, by providing a `packages.json`
with just the libraries you need.

To make it work, the [README](https://github.com/researchgate/broker#readme)
is really clear:

    $ git clone git://github.com/researchgate/broker.git
    $ cd broker
    $ curl -s https://getcomposer.org/installer | php
    $ php composer.phar install
    $ php broker.php broker:add project_name path/to/project/composer.json

This will download all your vendors into the `repositories/project_name`
folder. Once you've set up your server to point on the root directory of
Broker, you could had it to your `composer.json` file:

```json
{
    "repositories": [
        {
            "type": "composer",
            "url": "http://broker-server/repositories/project_name"
        }
    ],
    "require": {
        "symfony/symfony": "2.1.*"
    }
}
```

I would recommend this method which is much easier than the previous one, and
also much more powerfull as it is provided for Composer. However, keep in mind
to update your proxy repositories first before running a `composer update`.

## The missing option

Both of the previous methods work, but they have the same major incovenient:
you have to modify the `composer.json` to use the proxy. In the case of
a private project for your company it is not a real problem as every developer
will use the company proxy. But it can be more problematic on an open source
project as the file will **no longer be shareable.**

In my opinion, that would be a nice option for Composer to use a local proxy:

    $ php composer.php install --proxy http://composer-proxy.local/

Or event use a local folder to download the vendors before copying them to
your project:

    $ php composer.php install --proxy /path/to/cache

In that case, Composer will explicitly tell the proxy what vendors to
clone/download, and then it will download/copy the needed ones in your
project. Thereby, every developer using the same proxy will save time and
bandwidth, and even you, if you are working on several projects on your
machine, will be able to download vendors only once.

What do you think about that?

[composer]: http://getcomposer.org/
[symfony]: http://symfony.com/
[doctrine]: https://github.com/doctrine/doctrine2
[twig]: http://github.com/fabpot/Twig
[pagodabox]: http://henrik.bjrnskov.dk/using-composer-on-pagodabox/
[heroku]: http://bergie.iki.fi/blog/using_composer_to_manage_dependencies_in_heroku_php_apps/
[jenkins]: http://jenkins-ci.org/
[travis]: http://travis-ci.org/
[gitpod]: https://github.com/sitaramc/gitpod
[satis]: http://getcomposer.org/doc/articles/handling-private-packages-with-satis.md
[broker]: https://github.com/researchgate/broker
