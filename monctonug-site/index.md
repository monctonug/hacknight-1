# Moncton Developer User Group Site

What would it take to make the [Moncton UG site](https://github.com/monctonug/monctonug-site) even simpler to host/manage.

The site is currently served statically from a [Digital Ocean](https://www.digitalocean.com/) instance and generated using [Middleman](https://middlemanapp.com/). It's updated by running `publish.sh` via ~~cron~~ Vincent.

When publishing the site today, `sync.rb` will fetch event information from the Eventbrite API and add pages to `sources/articles/` in a format that is ready to commit+build. This is not a strict requirement and it would be fine if adding a new event to the site meant having to create a new markdown file by hand.

Some of the options I'm thinking about which can be explored separately.


## 1) GitHub Pages

Use GitHub Pages similar to how [this](https://monctonug.github.io/mug-hacknight-1/) page is built and hosted. It's generated from the GitHub master branch as per the instructions [here](https://github.com/blog/2289-publishing-with-github-pages-now-as-easy-as-1-2-3).

You can find more information about how to customize GitHub Pages [here](https://help.github.com/categories/customizing-github-pages/)

This option is especially attractive to me because the only thing required to update the page is push changes to GitHub.


## 2) Caddy + Hugo

[Caddy](https://caddyserver.com/) is a server that includes automatic https (using [Let's Encrypt](https://letsencrypt.org/). It supports rendering markdown out of the box, or the [Hugo](http://gohugo.io/) add-on could be added if more complexity is required.


## 3) Your Better Idea

TBD =)
