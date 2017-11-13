# Ludum Dare

This is the new pre-alpha Ludum Dare site! It's currently live here: 

https://ldjam.com/

Wan't to help out? Setup Instructions are here:

https://github.com/ludumdare/dairybox

Development discussion (site-dev only please): 

* **Web:** https://gitter.im/ludumdare/ludumdare (Slack-like)
* **IRC:** https://irc.gitter.im/

# Structure
Many folder are documented. Just browse the tree to learn about the contents.

### Source Code
Source code is found here:

* [/src](src/) - Source Code (PHP, JavaScript, CSS, etc)

### Live sites
These folders contain the live sites that are served. They tend to be simple `PHP` files that include things in the `/src` folder. They also contain the output of the toolchain (in the `/-/` subfolder).

* [/public-ludumdare.com](public-ludumdare.com/) - Ludum Dare focused version of the common site -- https://ldjam.com
  * This will be moving to `ludumdare.com` eventually.
* /public-jammer.tv - Not yet in this repository. Coming soon. -- https://jammer.tv
  * The TV widget uses the backend. The frontend site is not currently in active development.
* [/public-url.shortener](public-url.shortener) - A variety of URL shortening services. -- https://ldj.am, https://jam.mr
  * At the moment only https://ldj.am/$id is supported, where $id is the node_id to redirect to. e.g. https://ldj.am/$11
  
These are not currently in active development.
* [/public-jammer.vg](public-jammer.vg/) - Jammer, the general version of the common site -- https://jammer.vg
* [/public-jammer.bio](public-jammer.bio/) - Jammer Bio's, a variant focused on user pages. i.e. `jammer.bio/your-user-name`

### Other 
* [/public-api](public-api/) - Restful API calls. https://api.ldjam.com
  * NOTE: `/vx/` is experimental and may change. We are working towards a `/v1/` launch soon.
* [/public-static](public-static/) - Where static files go. Images, etc. -- https://static.jam.vg
* [/sandbox](sandbox/) - Old code, experiments, and debugging tools. Very chaotic here.
* `Makefile` - The core build script. Runs a variety of tools. Invoke from inside the VM (or outside with appropriate config).
  * `make` - Build changes
  * `make clean` - Delete all intermediate files so you can rebuild from scratch
  * Advanced build options
    * `make mini` - Like `make`, but this can be used to refresh the UID (used to bypass caching proxies, etc)
    * `make TARGET=public-ludumdare.com` - Make a specific target
  * `config.mk` - Create this file and you can hardcode makefile settings
    * `TARGET=public-ludumdare.com` to build just Ludum Dare
    * `JOBS=2` to compile using 2 threads (parallel build)
