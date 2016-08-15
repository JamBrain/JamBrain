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

// TODO: Figure out if this is the live server or not //
define( 'USE_MINIFIED', isset($_GET['debug']) ? '' : '.min' );
define( 'VERSION_STRING', defined('GIT_VERSION') ? 'v='.GIT_VERSION : '' );
const STATIC_DOMAINS = [ 
	'jammer.work' => 'static.jammer.work',
	'jammer.dev' => 'static.jam.dev',
];
define( 'STATIC_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], STATIC_DOMAINS ) ? STATIC_DOMAINS[$_SERVER['SERVER_NAME']] : 'static.jam.vg' );
define( 'LINK_SUFFIX', isset($_GET['nopush']) ? '; nopush' : '' );

define( 'JS_FILE',   "/-/all".USE_MINIFIED.".js?".VERSION_STRING );
define( 'CSS_FILE',  "/-/all".USE_MINIFIED.".css?".VERSION_STRING );
define( 'SVG_FILE',  "/-/all".USE_MINIFIED.".svg?".VERSION_STRING );
define( 'FONT_FILE', "//fonts.googleapis.com/css?family=Raleway|Lato:300,300italic,700,700italic" );

if ( !isset($_GET['nopreload']) ) {
	header( "Link: <".JS_FILE.">; rel=preload; as=script".LINK_SUFFIX, false );
	header( "Link: <".CSS_FILE.">; rel=preload; as=style".LINK_SUFFIX, false );
	header( "Link: <".SVG_FILE.">; rel=preload".LINK_SUFFIX, false );
	header( "Link: <".FONT_FILE.">; rel=preload; as=style", false );
}
//header("Link: </blah">; rel=canonical"); // https://yoast.com/rel-canonical/

//TODO: Determine page, and populate title and meta tags before continuing //

?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="<?=FONT_FILE?>" type="text/css">
	<link rel="stylesheet" href="<?=CSS_FILE?>" type="text/css">
</head>
<body>
	<script>
		<?php /* Output PHP Variables for JS */ ?>
		var VERSION_STRING = "<?=VERSION_STRING?>";
		var STATIC_DOMAIN = "<?=STATIC_DOMAIN?>";
		<?php /* Load SVG */ ?>
		<?php include __DIR__."/../embed/preload-svg.js.php"; ?>
	</script>
	<script src="<?=JS_FILE?>"></script>
</body>
</html>
