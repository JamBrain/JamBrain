# Source Code Home

Welcome to the source folder!

Inside you will find a variety of code in a variety of formats.

* `.php` - Backend code, and basic page generation
* `.js` - JavaScript code, much of it in ES6 format (if there's an `.es6ignore` file, then it's ES5 format)
* `.css` - CSS code
* `.less` - LESS format CSS code (gets compiled in to normal CSS files)
* `.svg` - SVG Images (used as sprites)

## Internal

* `/com/` - Preact.js Components. This is how most of the frontend is done. https://preactjs.com/
* `/internal/` - Internal Libraries (??)
* `/embed/` - Code that gets embedded in to (PHP) scripts
* `/main/` - The common Main used across sites

## Externals

* `/external/` - 3rd party libraries
* `/custom/` - Modified/customized versions of 3rd party libraries. Will require extra work to upgrade
* `/compat/` - Compatibility (Polyfills) for modern and upcoming features (Ecmascript, DOM, etc)

## Assets

* `/icons/` - SVG Icons (baked in to a single file)

## Sites
The data shared across sites is called the **Jammer Core**. Each site is a different interpretation of **Jammer Core**'s data.

* `/public-ludumdare.com/` - Ludum Dare (ludumdare.com) - Ludum Dare focused View
* `/public-jammer.vg/` - Jammer (jammer.vg) - Normal View
* `/public-jammer.bio/` - Jammer.Bio - User Page and Content View (like a portfolio)

Websites may have their own Externals, Components, etc.

## Other
* `/tools/` - Extra tools used by the toolchain
