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
	'ludumdare.org' => 'static.jammer.work',
	'jammer.work' => 'static.jammer.work',
	'ludumdare.dev' => 'static.jam.dev',
	'jammer.dev' => 'static.jam.dev',
];
const DEFAULT_STATIC_DOMAIN = 'static.jam.vg';

define( 'STATIC_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], STATIC_DOMAINS ) ? STATIC_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_STATIC_DOMAIN );
define( 'STATIC_ENDPOINT', '//'.STATIC_DOMAIN );
const SHORTNER_DOMAINS = [
	'ludumdare.org' => 'url.ludumdare.org',
	'ludumdare.dev' => 'url.ludumdare.dev',
	'jammer.work' => 'url.jammer.work',
	'jammer.dev' => 'url.jammer.dev',
	'ldjam.com' => 'ldj.am',
	'jammer.vg' => 'jam.mr',
];
const DEFAULT_SHORTNER_DOMAIN = 'ldj.am';

define( 'SHORTNER_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], SHORTNER_DOMAINS ) ? SHORTNER_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_SHORTNER_DOMAIN );
define( 'LINK_SUFFIX', isset($_GET['nopush']) ? '; nopush' : '' );
if ( !defined('API_DOMAIN') ) {
	define( 'API_DOMAIN', 'api.'.$_SERVER['SERVER_NAME'] );
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

	<meta name=viewport content="width=device-width, initial-scale=1">
</head>
<body>
	<script>
		<?php /* Output PHP Variables for JS */ ?>
		var DEBUG = <?=DEBUG?>;
		var VERSION_STRING = "<?=VERSION_STRING?>";
		var STATIC_DOMAIN = "<?=STATIC_DOMAIN?>";
		var STATIC_ENDPOINT = "<?=STATIC_ENDPOINT?>";
		var SHORTNER_DOMAIN = "<?=SHORTNER_DOMAIN?>";
		var API_DOMAIN = "<?=API_DOMAIN?>";
		var API_ENDPOINT = "<?=API_ENDPOINT?>";
		var SERVER_TIMESTAMP = "<?=gmdate('Y-m-d\TH:i:s.000\Z'/*DATE_W3C*/);?>";
		var CLIENT_TIMESTAMP = new Date().toISOString();
		var SECURE_LOGIN_ONLY = <?= defined('SECURE_LOGIN_ONLY') ? ((SECURE_LOGIN_ONLY && !isset($_GET['insecure']))?'true':'false') : 'false' ?>;
		<?php /* Load SVG */ ?>
		<?php include __DIR__."/../embed/preload-svg.js.php"; ?>
	</script>
	<script src="<?=JS_FILE?>"></script>
	<noscript>This website requires JavaScript</noscript>
</body>
</html>
