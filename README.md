# Jammer Core
Jammer Core is the software that runs Ludum Dare game jam events. It is currently live on [ldjam.com](https://ldjam.com/)

**NOTE**: For better clarity, we are rebranding this software to **Jammer Core** (formerly `ludumdare`). The Ludum Dare game jam is still Ludum Dare, but to help reduce confusion with everything else called Ludum Dare, the software powering Ludum Dare has a new name.

[![Build Status](https://travis-ci.org/ludumdare/ludumdare.svg?branch=master)](https://travis-ci.org/ludumdare/ludumdare)

Want to help out? Setup Instructions are here:

https://github.com/JammerCore/DairyBox

Development discussion (site-dev only please): 

* **Web:** https://gitter.im/ludumdare/ludumdare (Slack-like)

# Structure
Many folder are documented. Just browse the tree to learn about the contents.

### Source Code
Source code is found here:

* [/src](src/) - Source Code (PHP, JavaScript, CSS, etc)

### Live sites
These folders contain the live sites that are served. They tend to be simple `PHP` files that include things from the `/src` folder. They also contain the output of the toolchain (in the `/-/` subfolder).

* [/public-ludumdare.com](public-ludumdare.com/) - Ludum Dare focused version of the common site -- https://ldjam.com
  * This will be moving to `ludumdare.com` eventually.
* [/public-url.shortener](public-url.shortener) - A variety of URL shortening services. -- https://ldj.am, https://jam.mr
  * At the moment only https://ldj.am/$id is supported, where $id is the node_id to redirect to. e.g. https://ldj.am/$11
  
These are not currently in active development.
* [/public-jammer.bio](public-jammer.bio/) - Jammer Bio's, a variant focused on user pages. i.e. `jammer.bio/your-user-name`

### Other 
* [/public-api](public-api/) - Restful API calls. https://api.ldjam.com
  * NOTE: `/vx/` is experimental and may change. We are working towards a `/v1/` launch soon.
* [/public-static](public-static/) - Where static files go. Images, etc. -- https://static.jam.vg
* [/sandbox](sandbox/) - Old code, experiments, and debugging tools. Very chaotic here.

# The Makefile
The `Makefile` is the core build script. It is used to build the project. Invoke it with the `make` command from inside the VM (or outside with appropriate config).

Usage:
  * `make` - Compile all changed files and build the target
  * `make clean` - Delete all intermediate files. NOTE: When you `make` again, everything needs to be recompiled
  * `make lint` - Run all code through the linter. NOTE: `make` only lints files that have changed. This lints everything
  * Advanced build options
    * `make all` - Build all targets (default, until you set TARGET in `config.mk`)
    * `make TARGET=public-ludumdare.com` - Make a specific target (in this case, `public-ludumdare.com`)
    * `make mini` - Like `make`, but refreshes the UID (used to bypass caching proxies, etc)
    * `make clean-some` - Clean, but don't delete the output files (useful when clean building on live)
    * `make clean-all` - Clean all targets
    * `make clean-svg`, `make clean-css`, `make clean-js` - Clean specifically the SVG, CSS, or JS
    * `make clean-all-svg`, `make clean-all-css`, `make clean-all-js` - Clean specifically the SVG, CSS, or JS of all targets
    * `make lint-all` - Lint all code for all targets
    * `make lint-css`, `make lint-js`, `make lint-php` - Lint specifically the CSS, JS and PHP code
    * `make lint-all-css`, `make lint-all-js`, `make lint-all-php` - Lint specifically the CSS, JS, or PHP code of all targets
    * `make clean-lint` - Force re-linting of everything on build
  * `config.mk` - Create this file and you can hardcode makefile settings
    * `TARGET=public-ludumdare.com` to build just Ludum Dare
    * `DEBUG=true` to enable debug builds (append `?debug` to the URL)
    * `SOURCEMAPS=true` to enable Source Maps. **NOTE:** Requires a full rebuild when changed
    * `JOBS=2` to compile using 2 threads (parallel build)
      * **NOTE**: VirtualBox is really bad at threads. Beyond 2, you start seeing serious diminishing returns, to the point where it actually gets worse than 2 the higher you go.
      * If you actually want to try values other than `1` and `2`, it you'll need to change the number of CPUs in `Vagrantfile`, as well as set JOBS.
      * Below is a list of benchmarks, testing different combinations of CPUs and Jobs. Testing on an AMD FX-8350 (8 core, which is not Hyperthreaded, but rather has 2 cores per die that share caches)
    * `NOCOLOR=1` to disable color escape codes from output

### config.mk JOBS benchmarks

```
C,J  Sec   Change Diff
-----------------------
1,1: 901 = 100% = 0%
2,2: 521 = 173% = 73%
3,3: 427 = 211% = 38%
4,4: 401 = 225% = 14%
8,8: 824 = 109% = -116%
```
