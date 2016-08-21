# Compatability

The libraries here are added specifically to support legacy browsers.

The current minimum spec is:

* ES5 Compatible Browsers
* Internet Explorer 11

It's assumed Microsoft browsers are the most feature incomplete of the major browsers. Patches/Polyfills to support specific browsers can be found in these folders.

* `/ie11/` - Internet Explorer 11 (Windows Phone 8.1, etc)
* `/edge/` - Microsoft Edge (Windows Phone 10, Xbox One, etc)
* `/webkit/` - Webkit Browsers (Safari, Opera, Blackberry Browser, etc)
* `/chrome/` - Google Chrome, Chromium and Blink powered browsers
* `/moz/` - Mozilla Browsers (Firefox, etc)

If they are missing, it means no patch/polyfill is requried.

Patches/Polyfills for new features not (or poorly) supported by modern browsers are found here:
* `/es6/` - (also known as ES2015) http://exploringjs.com/es6/
* `/es2016/` - http://www.2ality.com/2016/01/ecmascript-2016.html
* `/es2017/` - http://www.2ality.com/2016/02/ecmascript-2017.html

Of note, many of the available ES6 features are made available by the toolchain, thanks to Buble. The code is then transpiled back in to ES5.

# Obsoleted

Patches for browsers that have been obsoleted can be found in `/_obsolete/`. These are being kept around just in case, but could be removed at any time.

Because the `/_obsolete/` folder begins with an underscore, the toolchain knows to ignore it, and anything inside it.
