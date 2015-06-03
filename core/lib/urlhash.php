<?php
require_once __DIR__ . "/external/hashids/HashGenerator.php";
require_once __DIR__ . "/external/hashids/Hashids.php";

// NOTE: Consider *NOT* using Hashids for this, because protecting our IDs is not important.
//       What's actually important is consistency. These URLs should never change.
//       The reason I am using Hashids is because it handles profanity urls.

// NOTE 2: If we write our own, consider making character zero '-'. That way, it means we
//         can easily reserve a url like http://ldj.am/-/... for something special.

// Global URL Hasher //
$urlhash_salt = 'This SALT will be used to hash Ludum Dare URLs... I guess';
$urlhash_Hashids = new Hashids\Hashids($urlhash_salt);

// Given a number, do a YouTube style encode as a string //
function urlhash_Encode( $in ) {
	global $urlhash_Hashids;
	return $urlhash_Hashids->encode($in);
}

// Given a string, do a YouTube style decode in to a number //
function urlhash_Decode( $in ) {
	global $urlhash_Hashids;
	return $urlhash_Hashids->decode($in)[0];	// NOTE: always returns an array
}

?>
