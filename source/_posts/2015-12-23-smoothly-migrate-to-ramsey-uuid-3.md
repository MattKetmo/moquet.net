---
title: Smoothly migrate to ramsey/uuid 3.x
layout: post
description: |
  Presentation of the mattketmo/uuid-2x-bridge hack to allow using
  ramsey/uuid:3.x even if one of your dependencies requires version 2.x
---

When dealing with UUID generation in PHP, developers usually decide to use the famous [ramsey/uuid](https://github.com/ramsey/uuid) library.
95% of the time the only method used is `Ramsey\Uuid\Uuid::uuid4()` which generates a random UUID (the [version 4](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29) in the UUID specification). Despite I'm not fan of static methods, this does the job pretty well.

## The namespace issue

A lot of applications and libraries started to use `ramsey/uuid` in version 2. At that time the package had a different name (`rhumsaa/uuid`) and every class was under the `Rhumsaa` namespace.
[Ben Ramsey](https://github.com/ramsey) renamed the package first (the `rhumsaa/uuid` name is now deprecated) but only changed namespace since version 3.0. Which means libraries started using the `ramsey/uuid` with version 2.x (the `Rhumsaa` namespace) and make it incompatible with version 3.x (the `Ramsey` namespace).

Thus if you want to use `ramsey/uuid: ^3.0` but one of your dependencies is still using version `2.x` then you're screwed.
If the package `ramsey/uuid` was created for versions `3.0+` **only** we could have had both requirements (like Guzzle did between version 3 and 4). But unfortunatly that's not the case.

Updating version of `ramsey/uuid` in a project is an easy task: just grep and sed the `Rhumsaa` namespace. But if you change the requirements on a library which uses it on its public API, then you're creating a **non-BC change** and need to publish a new major version of your library. That change may have huge impact on users who depend on it. And if those users depend on another lib which requires a different version of the uuid lib then it's a mess. They will need to coordinate all updates at the same time.

However it looks pretty easy to resolve this issue. We "just" need to ensure the `Rhumsaa\Uuid\Uuid` class still exists.

## The hack

To address this issue I created a tiny composer package which exposes the `Rhumsaa\Uuid\Uuid` class (which simply inherit of `Ramsey\Uuid\Uuid`) and declares to composer it can replace the `ramsey/uuid:2.x` package. The package is available at [`mattketmo/uuid-2x-bridge`](https://github.com/MattKetmo/uuid-2x-bridge).

Then if you want to use `ramsey/uuid:^3.0` in your app but one of your dependencies is still using `Rhumsaa\Uuid\Uuid`, then simply run:

```bash
composer require "mattketmo/uuid-2x-bridge:*@dev"
```

Note that will only works if the libraries just need the main `Uuid` class. For Doctrine type and console component the packages [`uuid-doctrine`](https://github.com/ramsey/uuid-doctrine) and [`uuid-console`](https://github.com/ramsey/uuid-console) can be installed separately.

You can read the discussion in this [pull request](https://github.com/prooph/common/pull/47) which led me to do this hack. It's not very beautiful, but it works.


## A note on package dependencies

Now that users have a way to not wait their dependencies update the `ramsey/uuid` requirement, all libraries can take the time for their next major version release to do the update.

But I want to point out the risk for library maintainers to depend on specific version of a package.
If you own a widly used library, try as much a possible to not require other libraries directly. Most of the time an abstraction or an adapter will be enough. For instance the team behind the [Broadway](https://github.com/qandidate-labs/broadway) library created the [broadway-uuid-generator](https://github.com/qandidate-labs/broadway-uuid-generator) to not depend direclty on Ramsey's implementation (and also to not rely on a static method call).

Even if it won't work for every usage, try to minimalize that risk. Ultimately that's what some [P](http://www.php-fig.org/psr/psr-3/)[S](http://www.php-fig.org/psr/psr-6/)[R](http://www.php-fig.org/psr/psr-7/) are for, [isn't it?](http://cdn.meme.am/instances/500x/63628685.jpg) ;).

In other words, **think twice before forcing to your users a new dependency**.

