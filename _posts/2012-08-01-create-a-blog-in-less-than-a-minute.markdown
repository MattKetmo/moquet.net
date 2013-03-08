---
layout: post
title: How to create a blog in less than a minute
tags: [jekyll, site]
---

> Yo dawg! I heard you like blogs. So I started a blog and blogged about how to
> create a new blog. So you can learn to blog while reading this blog.


Hi everyone! I'm Matthieu Moquet, a french PHP web developer, currently
working on the future of the awesome [BlaBlaCar][] startup. To introduce myself
in a few words, I'm a [Symfony][] lover, an [Android][] fanboy, an intensive
[git][] & [vim][] user, and this blog will be all about that.

For my very first article, let's see **how this blog was created**, in a very
simple way, using [Jekyll][].

Jekyll is a simple **static site generator**. It will transform all your HTML
& markdown/textile content into ordered HTML files. It allows you write articles in
simple text files and create static HTML pages, but without repeating the
layout of your site.

# Prerequisites

You must:

- be able to [install Jekyll][install]: `sudo gem install jekyll`
- know basic markup languages such as [HTML][], [Markdown][], and [Yaml][]
- know Git and have an account on [Github][] (optional but useful to make it
  online)

# Initialize the structure

First we're going to create the basic structure of our app. The content of each
folder we need is described in [Jekyll Usage page][usage]:

    $ mkdir _layouts _posts
    $ touch index.html _config.yml _layouts/{default,post}.html

You can customize the default [configuration][config] by editing the
`_config.yml` file. For now, let's configure the permalinks of each post, with
the date and the slug. There is an option to make pretty URLs automatically:

    permalink: pretty

# Create a basic layout

Let's have something to watch! We'll now create the layouts and the homepage.

- `_layouts/default.html` will contain our main layout (header, body & footer)
- `_layouts/post.html` will overload the default one to had the structure of
  the article (a title, some metadata and a body)
- `index.html` will contain what we want to show on our homepage (for instance,
  the list of all blog posts)

Now what about the content? Jekyll offers you [several variables][vars] to
display your content. It uses the [Liquid templating][liquid] system to display
them. If you're familiar with templating engine like Twig or Jinja, you should
feel confortable with it.

The *inheritance* system works by using the `content` variable in the layout
file, which will be replaced by the content of the file using this layout.
Specifying a layout can be done in the [Front Matter][front] of any file.

Lets see an example of a basic structure:

`_layouts/default.html`: defines the basic structure

{% highlight html %}
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Blog</title>
</head>
<body>
    {{ '{{' }} content }}
</body>
</html>
{% endhighlight %}

`index.html`: defines the homepage where we list all blog articles

{% highlight html %}
---
layout: default
---

<h1>Blog post</h1>

<ul>
    {{ '{%' }} for post in site.posts %}
        <li>
            {{ '{{' }} post.date|date_to_string }} »
            <a href="{{ '{{' }} post.url }}">{{ '{{' }} post.title }}</a>
        </li>
    {{ '{%' }} endfor %}
</ul>
{% endhighlight %}


`_layouts/post.html`: defines the post layout

{% highlight html %}
---
layout: default
---

<article class="post">
    <header>
        <h2>{{ '{{' }} page.title }}</h2>
        <time datetime="{{ '{{' }} page.date|date: "%Y-%m-%d" }}">
            {{ '{{' }} page.date|date_to_string }}
        </time>
    </header>

    <div class="entry">
        {{ '{{' }} content }}
    </div>
</article>
{% endhighlight %}


And then I just have to add a new markdown file in the `_posts` directory
(following the convention `YYYY-MM-DD-slug-of-the-post.markdown`) to add a new
blog post:

{% highlight html %}
---
layout: post
title: This is an example
---

Hi folks! This is an example of content.
{% endhighlight %}

That's it! We've created a blog in a few lines. You're now ready to [push it
online on GitHub](https://help.github.com/articles/using-jekyll-with-pages).

# Go further

Of course, Jekyll has a lot more features not presented in this article. The
best way to learn is to have a look at the many [sites using
Jekyll](https://github.com/mojombo/jekyll/wiki/Sites).

Here are some quick improvements you can do:

* enable **RSS feeds** by adding an [atom.xml][atom_file] file
* enable dynamic comments with services like [Disqus][] or [Livefyre][] (javascript only)
* use code highlight with [Pygments][]

There are also plenty of [plugins][] (written in ruby) you can use.

To simplify the installation of Jekyll, you can even use [JekyllBootstrap][] which
will initialize the structure for you and put it on your Github account. It
has several themes you can use if you don't want to play with CSS.

I also recommend to read [how Jekyll was born][born], a nice article by its
creator which will give you a better understanding of the spirit of static blog
generators like Jekyll.

[born]: http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html

[blablacar]: http://www.blablacar.com/
[symfony]: http://symfony.com/
[android]: http://developer.android.com/
[git]: http://git-scm.com/
[vim]: http://www.vim.org/

[install]: https://github.com/mojombo/jekyll/wiki/Install
[usage]: https://github.com/mojombo/jekyll/wiki/usage
[config]: https://github.com/mojombo/jekyll/wiki/configuration
[vars]: https://github.com/mojombo/jekyll/wiki/Template-Data
[front]: https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter
[liquid]: https://github.com/shopify/liquid/wiki/liquid-for-designers

[disqus]: http://disqus.com/
[livefyre]: http://www.livefyre.com/
[atom_file]: https://github.com/MattKetmo/mattketmo.github.com/blob/master/atom.xml
[pygments]: https://github.com/mojombo/jekyll/wiki/Liquid-Extensions
[jekyllbootstrap]: http://jekyllbootstrap.com/
[plugins]: https://github.com/mojombo/jekyll/wiki/Plugins

[bootstrap]: http://twitter.github.com/bootstrap
[compass]: http://compass-style.org
[github]: http://github.com
[h5bp]: http://html5boilerplate.com
[html]: http://en.wikipedia.org/wiki/HTML
[jekyll]: http://github.com/mojombo/jekyll
[markdown]: http://en.wikipedia.org/wiki/Markdown
[sass]: http://sass-lang.com
[symfony2]: http://symfony.com
[yaml]: http://en.wikipedia.org/wiki/YAML
[git]: http://git-scm.com/
[vim]: http://www.vim.org/
[android]: http://developer.android.com/
