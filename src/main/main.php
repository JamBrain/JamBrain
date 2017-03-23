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

@include __DIR__."/../config.php";

// http://stackoverflow.com/a/9535967/5678759
function make_slug( $string, $separator = '-' ) {
//	$accents_regex = '~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i';
//	$special_cases = array( '&' => 'and', "'" => '');
	$string = mb_strtolower( trim( $string ), 'UTF-8' );
//	$string = str_replace( array_keys($special_cases), array_values( $special_cases), $string );
//	$string = preg_replace( $accents_regex, '$1', htmlentities( $string, ENT_QUOTES, 'UTF-8' ) );
	$string = preg_replace("/%[a-f0-9]{2}/u", "$separator", $string);
	$string = preg_replace("/[^a-z0-9]/u", "$separator", $string);
	$string = preg_replace("/[$separator]+/u", "$separator", $string);
	$string = trim($string, "$separator");
	return $string;
}

$URL = strtok( isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : $_SERVER['REQUEST_URI'], '?' );

$URL_PARTS = explode('/',ltrim($URL,'/'));
foreach ( $URL_PARTS as &$PART ) {
	$PART = make_slug($PART);
}

// TODO: Figure out if this is the live server or not //
define( 'USE_MINIFIED', isset($_GET['debug']) ? '' : '.min' );
define( 'VERSION_STRING', defined('GIT_VERSION') ? 'v='.GIT_VERSION : '' );
const STATIC_DOMAINS = [ 
	'ludumdare.org' => 'static.jammer.work',
	'jammer.work' => 'static.jammer.work',
	'ludumdare.dev' => 'static.jam.dev',
	'jammer.dev' => 'static.jam.dev',
];
const DEFAULT_STATIC_DOMAIN = 'static.jam.vg';

define( 'STATIC_DOMAIN', array_key_exists( $_SERVER['SERVER_NAME'], STATIC_DOMAINS ) ? STATIC_DOMAINS[$_SERVER['SERVER_NAME']] : DEFAULT_STATIC_DOMAIN );
define( 'LINK_SUFFIX', isset($_GET['nopush']) ? '; nopush' : '' );
define( 'API_DOMAIN', 'api.'.$_SERVER['SERVER_NAME'] );
define( 'API_ENDPOINT', '/vx' );

define( 'JS_FILE',   "/-/all".USE_MINIFIED.".js?".VERSION_STRING );
define( 'CSS_FILE',  "/-/all".USE_MINIFIED.".css?".VERSION_STRING );
define( 'SVG_FILE',  "/-/all".USE_MINIFIED.".svg?".VERSION_STRING );
define( 'FONT_FILE', "//fonts.googleapis.com/css?family=Raleway:500,500italic,800,800italic|Lato:300,300italic,400,400italic,700,700italic" );

if ( !isset($_GET['nopreload']) ) {
	header( "Link: <".JS_FILE.">; rel=preload; as=script".LINK_SUFFIX, false );
	header( "Link: <".CSS_FILE.">; rel=preload; as=style".LINK_SUFFIX, false );
	header( "Link: <".SVG_FILE.">; rel=preload".LINK_SUFFIX, false );
//	header( "Link: <".FONT_FILE.">; rel=preload; as=style", false );
}
//header("Link: </blah">; rel=canonical"); // https://yoast.com/rel-canonical/

//TODO: Determine page, and populate title and meta tags before continuing //

?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="<?=FONT_FILE?>" type="text/css">
	<link rel="stylesheet" href="<?=CSS_FILE?>" type="text/css">
	<meta name=viewport content="width=device-width, initial-scale=1">
</head>
<body>
	<script>
		<?php /* Output PHP Variables for JS */ ?>
		var VERSION_STRING = "<?=VERSION_STRING?>";
		var STATIC_DOMAIN = "<?=STATIC_DOMAIN?>";
		var API_DOMAIN = "<?=API_DOMAIN?>";
		var SERVER_TIMESTAMP = "<?=gmdate('Y-m-d\TH:i:s.000\Z'/*DATE_W3C*/);?>";
		var CLIENT_TIMESTAMP = new Date().toISOString();
		var SECURE_LOGIN_ONLY = <?= defined('SECURE_LOGIN_ONLY') ? ((SECURE_LOGIN_ONLY && !$_GET['insecure'])?'true':'false') : 'false' ?>;
		<?php /* Load SVG */ ?>
		<?php include __DIR__."/../embed/preload-svg.js.php"; ?>
	</script>
	<script src="<?=JS_FILE?>"></script>
	<noscript>This website requires JavaScript</noscript>
</body>
</html>
