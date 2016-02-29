Para Pesquisa Admin Panel
==========================

Dependencies
-------------------------
* AngularJS: [angular/angular.js](https://github.com/angular/angular.js)
* Bower as front-end package manager: [bower/bower](https://github.com/bower/bower)
* Twitter Bootstrap 3 as front-end framework: [twbs/bootstrap](https://github.com/twbs/bootstrap)
* Beautiful slim progress bar, nprogress: [rstacruz/nprogress](http://github.com/rstacruz/nprogress)
* Glyphicons for Bootstrap: [twbs/bootstrap-glyphicons](https://github.com/twbs/bootstrap-glyphicons)
* Jekyll as static site generator: [mojombo/jekyll](https://github.com/mojombo/jekyll)
* And LESSHat for a bunch of LESS mixins: [CSSHat/LESSHat](https://github.com/CSSHat/LESSHat)

Running
-------------------------
After clone repo:
* install node and npm from node.org
* Run `npm install`
* Run `bower install`
* Set on `~/.profile` command `export NODE_ENV=production` to create a minified bundle, anything
that difers of production at NODE_ENV will produce a bundle without minify.
* Set on `~/.profile`command `export API_URL=http://xbox-is-better.com:8001`. `API_URL` will refer
the RESTful API to being consume.
* Set on `~/.profile`command `export API_VERSION=1`. `API_VERSION` will refer the RESTful service version.
* Run `gulp`
