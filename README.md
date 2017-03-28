# Ludum Dare

This is the new pre-alpha Ludum Dare site! It's currently live here: 

https://ldjam.com/

Wan't to help out? Setup Instructions are here:

https://github.com/ludumdare/dairybox

Development discussion (site-dev only please): 

* **Web (Slack-like):** https://gitter.im/ludumdare/ludumdare
* **IRC:** https://irc.gitter.im/ (click for details)

# Structure
Many folder are documented. Just browse the tree to learn about the contents.

### Source Code
Source code is found here:

* [/src](src/) - Source Code (PHP, JavaScript, CSS, etc)

### Live sites
These folders contain the live sites that are served. They tend to be simple `PHP` files that include things in the `/src` folder. They also contain the output of the toolchain (in the `/-/` folder).

* [/public-ludumdare.com](public-ludumdare/) - Ludum Dare focused version of the common site -- https://ldjam.com (will move to `ludumdare.com` eventually)
* [/public-jammer.vg](public-jammer.vg/) - Jammer, the general version of the common site (not under active development)
* [/public-jammer.bio](public-jammer.bio/) - Jammer Bio, a variant focused on user pages. `jammer.bio/your-user-name` (not under active development)
* /public-jammer.tv - (not yet in this repository. Coming soon) -- https://jammer.tv
* [/public-url.shortener](public-url.shortener) - A variety of URL shortening services (`ldj.am`, `jam.mr`)

### Other 
* [/public-api](public-api/) - Restful API calls (**NB**: This will be moving soon, but for now the API's are here)
* [/public-static](public-static/) - Where static files go. Images, etc. -- https://static.jam.vg
* `/static` - Symlink/shorthand for static (**NB**: this may be removed)
* [/sandbox](sandbox/) - Old code, experiments, and debugging tools. Very chaotic here.
* `Makefile` - The core build script. Runs a variety of tools. Invoke with `make` from inside the VM
