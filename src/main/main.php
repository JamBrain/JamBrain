<?php
@include __DIR__."/../../.output/git-version.php";
if ( !defined('GIT_VERSION') ) {
	echo "<h1>Update in progress</h1><p>Please check back in a few minutes.</p>";
	die();
}

if ( !isset($_GET['ignore']) && strpos($_SERVER['HTTP_USER_AGENT'],'MSIE') !== false ) {
	include __DIR__."/../embed/obsolete-browser.php";
	die();
}

@include __DIR__."/../shrub/config.php";

// TODO: Figure out if this is the live server, and disable this feature if it is //
define( 'DEBUG', isset($_GET['debug'])?1:0 );
define( 'USE_MINIFIED', DEBUG ? '.debug' : '.min' );
define( 'VERSION_STRING', defined('GIT_VERSION') ? 'v='.GIT_VERSION : '' );

const STATIC_DOMAINS = [
	'ldjam.com' => 'static.jam.host',
	'beta.ldjam.com' => 'static.jam.host',
	'jammer.bio' => 'static.jam.host',
	'jam.host' => 'static.jam.host',

	'ldjam.work' => 'static.jammer.work',		// ldjam.com dev
	'bio.jammer.work' => 'static.jammer.work',	// jammer.bio dev
	'host.jammer.work' => 'static.jammer.work',	// jam.host dev
];
const DEFAULT_STATIC_DOMAIN = 'static.jam.vg';
if ( !defined('STATIC_DOMAIN') ) {
	define( 'STATIC_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], STATIC_DOMAINS ) ? STATIC_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_STATIC_DOMAIN );
}
define( 'STATIC_ENDPOINT', '//'.STATIC_DOMAIN );

const SHORTENER_DOMAINS = [
	'ldjam.work' => 'url.ldjam.work',			// dev
	'ldjam.com' => 'ldj.am',
	'beta.ldjam.com' => 'ldj.am',
	//'bio.jammer.work' => '???',
	//'bio.jammer.dev' => '???',
	//'jammer.bio' => '???',
];
const DEFAULT_SHORTENER_DOMAIN = 'ldj.am';
if ( !defined('SHORTENER_DOMAIN') ) {
	define( 'SHORTENER_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], SHORTENER_DOMAINS ) ? SHORTENER_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_SHORTENER_DOMAIN );
}

const API_DOMAINS = [
	'ldjam.work' => 'api.ldjam.work',				// dev
	'ldjam.com' => 'api.ldjam.com',
	'beta.ldjam.com' => 'api.ldjam.com',
	'jam.ludumdare.com' => 'api-jam.ludumdare.com', // ???

	'bio.jammer.work' => 'api.jammer.work',			// dev
	'jammer.bio' => 'api.jammer.bio',

	'host.jammer.work' => 'api.jammer.work',		// dev
	'jam.host' => 'api.jam.host',
];

const DEFAULT_API_DOMAIN = 'api.jam.host';
define( 'LINK_SUFFIX', isset($_GET['nopush']) ? '; nopush' : '' );
if ( !defined('API_DOMAIN') ) {
	define( 'API_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], API_DOMAINS ) ? API_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_API_DOMAIN );
}
define( 'API_ENDPOINT', '//'.API_DOMAIN );

define( 'JS_FILE',   "/-/all".USE_MINIFIED.".js?".VERSION_STRING );
define( 'CSS_FILE',  "/-/all".USE_MINIFIED.".css?".VERSION_STRING );
define( 'SVG_FILE',  "/-/all.min.svg?".VERSION_STRING );
define( 'FONT_FILE', "//fonts.googleapis.com/css?family=Raleway:600,600italic,800,800italic|Roboto:300,300italic,700,700italic&display=swap" );
define( 'FONT_DOMAIN', "//fonts.gstatic.com" );

if ( !isset($_GET['nopreload']) ) {
	header( "Link: <".JS_FILE.">; rel=preload; as=script".LINK_SUFFIX, false );
	header( "Link: <".CSS_FILE.">; rel=preload; as=style".LINK_SUFFIX, false );
	header( "Link: <".SVG_FILE.">; rel=preload; as=fetch; crossorigin".LINK_SUFFIX, false );
//	header( "Link: <".FONT_FILE.">; rel=preload; as=style", false );
}
//header("Link: </blah">; rel=canonical"); // https://yoast.com/rel-canonical/

if ( defined('ONION_LOCATION') ) {
	//header("Onion-Location: ".ONION_LOCATION);
}

// This is insane, but necessary to stop iframing your website
header("X-Frame-Options: DENY");

$inline_js_nonce = bin2hex(random_bytes(8));
//header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$inline_js_nonce'; connect-src 'self' ".API_DOMAIN." api.jammer.tv; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: ".STATIC_DOMAIN." static-cdn.jtvnw.net i.ytimg.com cdn.jsdelivr.net; child-src 'self' files.jam.host www.youtube.com player.twitch.tv;");

// https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
// FYI: check out 'googlebot' and 'googlebot-news'

?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="<?=FONT_FILE?>" type="text/css">
	<link rel="preconnect" href="<?=FONT_DOMAIN?>">

	<link rel="stylesheet" href="<?=CSS_FILE?>" type="text/css">

	<!-- preconnect(tcp + ssl negoation) to our api and file domains -->
	<link rel="preconnect" href="<?=API_DOMAIN?>">
	<link rel="preconnect" href="<?=STATIC_DOMAIN?>">

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex">
</head>
<body>
	<script nonce="<?=$inline_js_nonce?>">
		<?php /* Output PHP Variables for JS */ ?>
		var DEBUG = <?=DEBUG?>;
		var STATIC_DOMAIN = "<?=STATIC_DOMAIN?>";
		var STATIC_ENDPOINT = "<?=STATIC_ENDPOINT?>";
		var SHORTENER_DOMAIN = "<?=SHORTENER_DOMAIN?>";
		var API_DOMAIN = "<?=API_DOMAIN?>";
		var API_ENDPOINT = "<?=API_ENDPOINT?>";
		var SERVER_TIMESTAMP = "<?=gmdate('Y-m-d\TH:i:s.000\Z'/*DATE_W3C*/);?>";
		var CLIENT_TIMESTAMP = new Date().toISOString();
		var SECURE_LOGIN_ONLY = <?= defined('SECURE_LOGIN_ONLY') ? ((constant("SECURE_LOGIN_ONLY") && !isset($_GET['insecure']))?'true':'false') : 'false' ?>;
		<?php /* Load SVG */ ?>
		<?php include __DIR__."/../embed/preload-svg.js.php"; ?>
	</script>
	<script src="<?=JS_FILE?>"></script>
	<noscript>This website requires JavaScript</noscript>
</body>
</html>
