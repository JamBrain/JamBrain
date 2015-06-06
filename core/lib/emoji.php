<?php
require_once __DIR__ . "/external/emojione/autoload.php";

// the Emoji library uses EmojiOne: http://emojione.com/

use Emojione\Emojione;

// NOTE: It's not clear how we switch to ASCII mode on the PHP side,
//   especially since the client loading is deprecated. That said, it's
//   not actually that important. We're doing our replacing in JS.

// On the PHP side we *ONLY* convert Unicode Emoji to Short Codes.
function emoji_ToShort($str) {
	return Emojione::toShort($str);
}

// This should not be used. For testing only.
//function emoji_ToImage($str) {
//	return Emojione::toImage($str);
//}

?>
