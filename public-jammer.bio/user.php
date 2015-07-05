<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/util.php";

// Retrieve Action and Arguments
$arg = util_ParseActionURL();
$user = array_shift($arg);
$arg_count = count($arg);


// Hack: Color Customizing.
$dark_bg = "622";
$light_bg = "CBB";
$dark_text = "FFF";
$light_text = "000";

// Dark BG //
if ( isset($_GET['db']) )
	$dark_bg = $_GET['db'];

// Light BG //
if ( isset($_GET['lb']) )
	$light_bg = $_GET['lb'];

// Dark Text, with fallback
if ( isset($_GET['dt']) )
	$dark_text = $_GET['dt'];
else if ( isset($_GET['lb']) )
	$dark_text = $_GET['lb'];

// Light text, with fallback
if ( isset($_GET['lt']) )
	$light_text = $_GET['lt'];
else if ( isset($_GET['db']) )
	$light_text = $_GET['db'];

// Hack: Image Inverting
$img = "W";
if ( isset($_GET['inv']) ) {
	$img = "B";
	
	$tmp = $dark_bg;
	$dark_bg = $light_bg;
	$light_bg = $tmp;

	$tmp = $dark_text;
	$dark_text = $light_text;
	$light_text = $tmp;
}


db_Connect();

?>
<?php template_GetHeader(); ?>
<style>
img, a {border:none; outline:none;} /* CSS RESET */
body {
	color:#<?php echo $dark_text; ?>;
	background:#<?php echo $dark_bg; ?>
}
.header {
	height:38px;
	text-align:center;
	margin-top:8px;
}
.body {
	color:#<?php echo $light_text; ?>;
	background:#<?php echo $light_bg; ?>;
	text-align:center;
	padding-top:16px;
	padding-bottom:16px;
}
.footer {
	/*color:#<?php echo $dark_text; ?>;	/* TODO: Should be 80% of value (premultiplying the alpha) */
	text-align:center;
	padding:8px;
	font-variant:small-caps;
}
.footer img {
	vertical-align:middle;
	opacity:0.8;
}
.footer img:hover {
	opacity:1.0;
}
.footer .mike {
	margin-bottom:4px; /* "Hair" is 4px tall, so offset the baseline for better centering */
	mix-blend-mode:screen;
}
</style>
<body>
<div class="header">
	<img src="<?php STATIC_URL(); ?>/logo/jammer/JammerLogo112<?php echo $img; ?>.png" height="56" />
</div>
<div class="body">
	<?php
		if ( $arg_count > 0 ) {
			echo $arg[0] . " by " . $user;
		}
		else {
			echo $user . "'s home page";
		}
	?>
</div>
<div class="footer">
	<a href="//jammer.bio"><img class="jammer" src="<?php STATIC_URL(); ?>/logo/jammer/JammerLogo56<?php echo $img; ?>.png" height="28" alt="Jammer" title="Jammer" /></a> by <a href="http://twitter.com/mikekasprzak" target="_blank"><img class="mike" src="<?php STATIC_URL(); ?>/logo/mike/Chicken32W.png" width="16" height="16" alt="Mike Kasprzak" title="Mike Kasprzak"></a> &nbsp;|&nbsp; powered by &nbsp;<a href="http://ludumdare.com" target="_blank"><img class="ludumdare" src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo40<?php echo $img; ?>.png" height="20" alt="Ludum Dare" title="Ludum Dare" /></a>
</div>

</body>
<?php template_GetFooter(); ?>
