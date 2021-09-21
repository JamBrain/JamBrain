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
* [/compat/](compat/) - Compatibility (Polyfills) for modern and upcoming features (Ecmascript, DOM, etc)

## Assets

* [/icons/](icons/) - SVG Icons (baked in to a single file)

## Sites
The data shared across sites is called the **Jammer Core**. Each site is a different interpretation of **Jammer Core**'s data.

* [/public-ludumdare.com/](public-ludumdare.com/) - Ludum Dare (ldjam.com) - Ludum Dare focused View
* [/public-jammer.vg/](public-jammer.vg/) - Jammer (jammer.vg) - Normal View
* [/public-jammer.bio/](public-jammer.bio/) - Jammer.Bio - User Page and Content View (like a portfolio)

Websites may have their own Externals, Components, etc.

## Other
* [/tools/](tools/) - Extra tools used by the toolchain
