**TODO:** Rework this page. The original page can be found below.

**TODO:** This first part should probably be a `language.md` file.

## Compatibility Targets
**EDIT:** This wording below isn't accurate. What needs to be identified are language syntax, language features, and browser features. The transpiler handles language syntax (and is nearly up to date),

General speaking, Safari 14 is our minimum spec. ~~The transpiler will accept most modern syntaxes, and generate code conforming to the ES2017 spec. If it will improve the code quality (simplify), any browser features introduced in Chrome and Firefox **BEFORE** 2018 can be used without checking if they exist, assuming it's also available in Safari 14 and Edge 97. Checking is still encouraged.~~


### Browser Engines
* ~~Any Blink (Chrome) and Gekko (Firefox) features from _before 2018_~~
* Webkit/Safari 14 from 2020
  * Introduced in iOS/iPadOS 14
    * Compatible with iOS devices from 2017+ (some 2015 too)
  * Compatible on MacOS 10.14 (Mojave) from 2018
    * Mojave is available for machines from as far back as 2012
* Edge 79 (Chromium) from 2020
* ~~Internet Explorer~~


### JavaScript Syntax
Handled by the transpiler. We generate code according to the ES2017 spec, but other syntaxes are available.

* ES2021
  * `??=` <https://caniuse.com/mdn-javascript_operators_logical_nullish_assignment>
  * `&&=`
  * `||=`
* ES2020
  * `?.` <https://caniuse.com/mdn-javascript_operators_optional_chaining>
  * `??` <https://caniuse.com/mdn-javascript_operators_nullish_coalescing>
* ES2019
  * tbd
* ES2018
  * tbd
* ES2017
  * `async` `await` <https://caniuse.com/async-functions>
* ES2016 (ES7)
  * `**` <https://caniuse.com/mdn-javascript_operators_exponentiation>
* ES2015 (ES6)
  * let, const, class
  * [`function*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) <https://caniuse.com/es6-generators>

### JavaScript Language
  * ES2017
    * Object.entries() <https://caniuse.com/object-entries>
    * Object.values() <https://caniuse.com/object-values>
  * ES2016 (ES7)
	* Array.prototype.includes() <https://caniuse.com/array-includes>
  * ES2015 (ES6)
	* isInteger <https://caniuse.com/es6-number>
    * String.prototype.includes() <https://caniuse.com/array-includes>
	* Typed Arrays (Int8Array, etc) <https://caniuse.com/typedarrays>



---

# Source Code Home

Welcome to the source folder!

Inside you will find a variety of code in a variety of formats.

* `.php` - Backend code, and basic page generation
* `.js` - JavaScript code, much of it in ES6 format (if there's an `.es6ignore` file, then it's ES5 format)
* `.css` - CSS code
* `.less` - LESS format CSS code (gets compiled in to normal CSS files)
* `.svg` - SVG Images (used as sprites)

## Internal

* [/com/](com/) - Preact.js Components. This is how most of the frontend is done.
* [/internal/](internal/) - Internal Libraries (??)
* [/embed/](embed/) - Code that gets embedded in to (PHP) scripts
* [/main/](main/) - The common Main used across sites
* [/shrub/](shrub/) - The CMS internals.

## Externals

* [/external/](external/) - 3rd party libraries
* [/custom/](custom/) - Modified/customized versions of 3rd party libraries. Will require extra work to upgrade
* [/polyfill/](polyfill/) - Compatibility (Polyfills) for modern and upcoming features (Ecmascript, DOM, etc)

## Assets

* [/icons/](icons/) - SVG Icons (baked in to a single file)

## Sites
The data shared across sites is called the **Jammer Core**. Each site is a different interpretation of **Jammer Core**'s data.

* [/public-ludumdare.com/](public-ludumdare.com/) - Ludum Dare (ldjam.com) - Ludum Dare focused View
* [/public-jammer.bio/](public-jammer.bio/) - Jammer.Bio - User Page and Content View (like a portfolio)

Websites may have their own Externals, Components, etc.

## Other
* [/tools/](tools/) - Extra tools used by the toolchain
