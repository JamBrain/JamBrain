# How to upgrade EmojiOne

Our version of EmojiOne.js is slightly customized:

* ns.asciiRegexp and ns.unicodeRegexp have the brackets "()" surrounding the regex removed.
  Instead, they are added directly to every usage of the regex (which is only a few times).
  The reason for this is that it makes it much easier to add my own Ascii and Unicode codes.
  In practice, we'll probably only ever do custom ASCII, but it's nice to have the option.
  To add to the regex, simply append a bunch of 'OR's to the end ( i.e. "|FishSteak|^_^").
  Be sure to escape them properly! "|FishSteak|\\^_\\^" (i.e. "\\^" is actually \^ in quotes)

* in "ns.shortnameToImage", the PNG no sprite shortcodes output needs a title. i.e. title="'+shortname+'"

```php
replaceWith = '<img class="emojione" alt="'+alt+'" title="'+shortname+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
```

* Also in the Ascii section, we need a title and instead of outputting the Unicode character
  as the alt (i.e. what you copy+paste), we'll output the original ASCII smiley. 
  i.e. alt="'+ns.escapeHTML(m3)+'" title="'+ns.escapeHTML(m3)+'"
  
```php
replaceWith = m2+'<img class="emojione" alt="'+ns.escapeHTML(m3)+'" title="'+ns.escapeHTML(m3)+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
```

# Adding custom Shortcodes
Append them to `emojione.emojioneList`.

```javascript
var MyCodes = {
	':key_a:':['CUSTOM/KEY_A'],
	':key_w:':['CUSTOM/KEY_W'],
	':dpad:':['CUSTOM/DPAD']
};

// Not Ideal! See: http://stackoverflow.com/a/17368101
array.prototype.push.apply(emojione.emojioneList,MyCodes);
```

Where `CUSTOM/KEY_A` assumes you created a `custom` folder alongside the unicode chars.

You'll note that the path is in caps. `ns.shortnameToImage` does a toUpperCase, so we must do it too.

Be sure to set `emojione.imagePathPNG` to point to your PNG image path, and not the default.
