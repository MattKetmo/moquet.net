---
layout: post
title: Distributing a PHP CLI app with ease
tags: [php]
description: |
  An example of command line tool in PHP using Symfony and the Box project.
  This explains how to easily build a PHAR file and how to create an auto-update command.
---

Something I love with PHP is how easily you can build a CLI application.
Some libraries like the Symfony Console Component has greatly
improved this process. Also, the ability to package a whole application
into a single PHAR container make the distribution and usage even
easier.

Such as [`composer`](http://getcomposer.org/) or [`php-cs-fixer`](http://cs.sensiolabs.org/),
let's see how to quickly build a PHAR file for your application
with self-update capabilities.

## The Symfony Console

First we need to create our CLI app. Let's call it [Cliph](https://github.com/MattKetmo/cliph).
For the example, we will build a typical [Symfony console](http://symfony.com/doc/current/components/index.html)
app with one « *hello world* » command.
Basically this results [in only 2 files](https://github.com/MattKetmo/cliph/commit/cd38f2438fe049033fe83d60c711d365cd68e261).
The first one is the command in the `src` folder:

```php
<?php

namespace Cliph\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class HelloCommand extends Command
{
    protected function configure()
    {
        $this
            ->setName('hello')
            ->setDescription('Say hello')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln('Hello World');
    }
}
```

And the second is the launcher in `bin/cliph`:

```php
#!/usr/bin/env php
<?php

require __DIR__.'/../vendor/autoload.php';

use Cliph\Command;
use Symfony\Component\Console\Application;

$application = new Application('Cliph', '0.1-dev');
$application->add(new Command\HelloCommand());
$application->run();
```

Our application is now ready to run:

    $ ./bin/cliph --version
    Cliph version 0.1-dev

    $ ./bin/cliph hello
    Hello World

## The Box Project

The next step is to package all the sources into one single executable
[PHAR](http://www.php.net/manual/en/intro.phar.php) file.

If you tried to build a PHAR file for your own CLI app, you may
already have read the [`Compiler.php` script from Composer][Compiler]. This script
is launched via `./bin/compile` and produces the `composer.phar` file.

[Compiler]: https://github.com/composer/composer/blob/1.0.0-alpha7/src/Composer/Compiler.php

Now we want the same thing for our app, but without writing any line of PHP.
That would be redundant for each project.
This is where the [Box Project](http://box-project.org/) comes in.
The idea behing this tool is to replace the usual `compile` script with
a simple JSON file.

The JSON file contains the location of the PHP files to combine, and
the executable to run. This is typically what we need for our app:

```json
{
    "chmod": "0755",
    "directories": [
        "src"
    ],
    "files": [
        "LICENSE"
    ],
    "finder": [
        {
            "name": "*.php",
            "exclude": ["Tests"],
            "in": "vendor"
        }
    ],
    "git-version": "package_version",
    "main": "bin/cliph",
    "output": "cliph.phar",
    "stub": true
}
```

As you notice, you can specify the source files using three different directives:

- `directories`: to import a whole directory, typically the source folder
- `files`: ideal to import in single file — here the license
- `finder`: if you want more advanced filters, this use the
  [Symfony Finder component](http://symfony.com/doc/current/components/finder.html).
  This is very handy to exclude some useless files like the tests.

Then come the options to customise the PHAR file. The `output` specifies
the name of the script; the `main` is the launcher script; we use `chmod`
to make it executable by default; and of course the `stub` must be enabled
for a CLI app.

Finally you may wonder what the `git-version` stands for. The value of this
parameter is used to replace any string in the source files. Here, any string
`@package_version@` is replaced by a version number based on the git
repository. To take advantage of this, we place it as the version parameter
on our main launcher `bin/cliph`:

```php
<?php
//...
$application = new Application('Cliph', '@package_version@');
```

Time to see the result. [Install Box](https://github.com/kherge/Box#as-a-phar-recommended)
if you did not already, then run:

    $ box build
    Building...
    $ ./cliph.phar --version
    Cliph version ad2fc07

Simple, isn't it? It's even better if use git tags to have a proper version number:

    $ git tag 1.0.0
    $ box build
    Building...
    $ ./cliph.phar --version
    Cliph version 1.0.0

Box will automatically use the git tag number if any, or fallback to the
commit hash. If a tag was created on a previous commit, the version may
look somthing like `1.0.0-1-gae87139` (ie. use of tag + commit hash).

## Auto updates

Now that we have our PHAR, it would be awesome to add a command to auto update
the app. Think of something like `composer self-update`,
but as usual with minimal code.

[php-phar-update]: https://github.com/herrera-io/php-phar-update

The library which will help us this time is [php-phar-update][].
This library handles the whole update process.
To make it work, we need to instanciate a `Manager` object from a `Manifest`
then run the update method.
The `Manifest` contains all the possible updates. Ideally it
reads a remote JSON file which contains the list of all available versions.
To host the `manifest.json` file, we will use GitHub pages.

Here is what look like our update command:

```php
<?php

namespace Cliph\Command;

use Herrera\Phar\Update\Manager;
use Herrera\Phar\Update\Manifest;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateCommand extends Command
{
    const MANIFEST_FILE = 'http://mattketmo.github.io/cliph/manifest.json';

    protected function configure()
    {
        $this
            ->setName('update')
            ->setDescription('Updates cliph.phar to the latest version')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $manager = new Manager(Manifest::loadFile(self::MANIFEST_FILE));
        $manager->update($this->getApplication()->getVersion(), true);
    }
}
```

Only two lines of code. Awesome, right? The first parameter of the `update`
method is the current version number (in order to compare with available versions),
while the second allows to download major version.
Here is the [full diff](https://github.com/MattKetmo/cliph/commit/b3555f4c81f27002893845d96fb69a79f757f47d)
of that new update feature.

Let's tag our new functionnality, and re-build the PHAR:

    $ git tag 1.1.0

    $ box build
    Building...

    $ ./cliph.phar
    Cliph version 1.1.0

    Available commands:
      hello   Say hello
      help    Displays help for a command
      list    Lists commands
      update  Updates cliph.phar to the latest version

Now we just have to put a `manifest.json`
plus the build PHAR into the [`gh-pages` branch](https://help.github.com/articles/creating-project-pages-manually#lets-get-crackin)
and deploy it to GitHub. Note that I used the `openssl sha1 <file>` command to
get the hash of the PHAR file.

    $ cat manifest.json
    [
        {
            "name": "cliph.phar",
            "sha1": "fbcded58df0ea838c17d56a5e3cdace56127d538",
            "url": "http://mattketmo.github.io/cliph/downloads/my-cli-1.1.0.phar",
            "version": "1.1.0"
        }
    ]
    $ tree
    .
    ├── downloads
    │   └── cliph-1.1.0.phar
    └── manifest.json

Yeah, we've just acheived the update command step.
To try it, let's upgrade Cliph version to 1.1.1 with that [new commit][commit111],
and the corresponding [manifest.json][manifest111].
Then, from a `1.1.0` vesion of our app, run the `update` command:

[commit111]: https://github.com/MattKetmo/cliph/commit/c808ae0b5467e6a0d3d91ba9ef75e492a4a4974a
[manifest111]: https://github.com/MattKetmo/cliph/commit/e0744142c5b4fd1e454d45bdc31c6f2ffd62ea1c

    $ ./cliph.phar --version
    Cliph version 1.1.0

    $ ./cliph.phar update
    Updated to the latest version

    $ ./cliph.phar --version
    Cliph version 1.1.1


## Sign your application

Now as a bonus part, we would like to sign our application.
PHAR files can be signed with a set of public & private keys — using for instance OpenSSL.
The archive is built with the private key, and to run the file
the public key must be put next to it:

« *If the phar archive is saved as `/path/to/my.phar`, the public key must be
saved as `/path/to/my.phar.pubkey`, or phar will be unable to verify the
signature.* » — [php.net](http://php.net/manual/en/phar.using.intro.php)

To generate an OpenSSL private key, you have choice to directly use the `openssl`
command, or the `box key:create`. Then, to sign the PHAR the only thing to do is
to add the `key` option into your `box.json` file:

```json
{
    "chmod": "0755",
    "...": "...",
    "stub": true,
    "key": "private.key"
}
```

Then if you run a `box build` you will see a new file `cliph.phar.pubkey`.
If you try to move or remove this file, you will get a `PharException`.

Note that if you have set a passphrase for your private key, you must report
it in the `box.json` (`"key-pass": "mypass"`). But if you do so, please don't
version this file.
Instead use a `box.json.dist` and overwrite it in your local environment.
However I must admit I'm not really fan of that solution.
In my opinion, an option in the `box` command would be clever
(eg. `box build --key private.key -p`).


## Automation

Last thing we want to do is to automate the whole process.
For the example, I wrote a stupid [bash script](https://github.com/MattKetmo/cliph/commit/5897c317f2a6a54208482540ef33d7316407a984)
which handle all the actions described in this post (git tag, box build, copy to gh-pages, update manifest).
It works with [`jsawk`](https://github.com/micha/jsawk) to manipulate the JSON file.

Now I just have to run:

```bash
$ ./bump-version.sh 1.3.0
```

And a new PHAR file is automatically created with the given version number,
and pushed to the `gh-pages`.

Thus we've finally learned in a few steps how to make our CLI app easily distributable.
The Box project is really something you have to look at if you are
building PHAR files. And of course, you can adapt the "self-update" part to your need.
Big thanks to [Kevin Herrera](https://github.com/kherge) for those tools,
that's very helpful.
