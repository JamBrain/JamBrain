# Compatability

The libraries here are added specifically to support legacy browsers.

The current minimum spec is:

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

(More info: http://kangax.github.io/compat-table/es6/)

Of note, many of the available ES6 features are made available by the toolchain, thanks to Buble. The code is then transpiled back in to ES5.

# Obsoleted

Patches for browsers that have been obsoleted can be found in `/_obsolete/`. These are being kept around just in case, but could be removed at any time.

Because the `/_obsolete/` folder begins with an underscore, the toolchain knows to ignore it, and anything inside it.

# What can I use?
We use a variety of Polyfills, and the Buble ES6 transpiler. For more details on Buble: https://buble.surge.sh/guide/

* All ES5 Features
  * no known exceptions (put them here if we find them)
* DOM classList (polyfill)
  * Nicer way to add/remove/toggle classes in the DOM
* DOM CustomEvent (polyfill)
  * Primarily used to create our own global events
* ES6+ES2016 Array's (polyfill)
  * New methods ES6: `a.copyWithin`, `a.fill`, `a.find`, `a.findIndex`, `a.from`, `a.of` 
  * New methods ES2016: `a.includes`
* ES6 Object's (polyfill) 
  * New methods: `o.assign`
    * Used to clone objects. i.e. `var orig = {'name':'bob'}; var copy; copy.assign({},orig);`
* ES6 Lambda/Arrow Functions (Buble)
  * i.e. `function(name) { return 'hello '+name; }` becomes `name => 'hello '+name`
* ES6 Classes (Buble)
  * NOTE: Buble's class support mirrors the ES6 spec. Babel extended features are unavailable.
    * `::` operator is unsupported (not part of the spec)
    * Member variables are not supported (use `this.myVar = blah;` in the `constructor()`)
* Imports (Rollup)
  * TODO: figure out what spec these are from
* ES6 Promise's (polyfill)
  * Nicer way to do async code, than nested callbacks
* ES-NEXT Fetch (polyfill)
  * This replaces XMLHttpRequest. Returns a Promise.

I've probably forgot some. I will try to keep this list updated.
