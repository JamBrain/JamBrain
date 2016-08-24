# Source Code Home

Welcome to the source folder!

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
Collectively, the data shared amongst websites it called the **Jammer Core**. Each website is a different interpretation or view of the **Jammer Core** data.

* `/public-ludumdare.com/` - Ludum Dare (ludumdare.com) - Ludum Dare focused View
* `/public-jammer.vg/` - Jammer (jammer.vg) - Normal View
* `/public-jammer.bio/` - Jammer.Bio - User Page/Content View

Websites may have their own Externals, Components, etc.

## Other
* `/tools/` - Extra tools used by the toolchain
