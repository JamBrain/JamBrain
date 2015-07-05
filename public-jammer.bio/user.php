<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/util.php";

// Retrieve Action and Arguments
$arg = util_ParseActionURL();
$user = array_shift($arg);
$arg_count = count($arg);


// Hack: Color Customizing.
$theme_color = "000";
if ( isset($_GET['color']) ) {
	$theme_color = $_GET['color'];
}

db_Connect();

//jammer.bio stub

//<strong>jammer<strong>, powered by <a href="http://ludumdare.com">Ludum Dare</a>

?>
<?php template_GetHeader(); ?>
<body>
	
<?php
	if ( $arg_count > 0 ) {
		echo $arg[0] . " by " . $user;
	}
	else {
		echo $user . "'s home page";
	}
?>

<br />
<br />
<br />
<br />

<style>
.footer {
	background:#<?php echo $theme_color; ?>;
	color:#FFF;
	text-align:center;
	padding:8px;
	font-variant:small-caps;
}
.footer img {
	vertical-align:middle;
}
.footer .mike {
	margin-bottom:4px; /* "Hair" is 4px tall, so offset the baseline for better centering */
	mix-blend-mode:screen;
}
</style>
<div class="footer">
	<a href="//jammer.bio"><img class="jammer" src="<?php STATIC_URL(); ?>/logo/jammer/JammerLogo56W.png" height="28" alt="Jammer" title="Jammer" /></a> by <a href="http://twitter.com/mikekasprzak" target="_blank"><img class="mike" src="<?php STATIC_URL(); ?>/logo/mike/Chicken32W.png" width="16" height="16" alt="Mike Kasprzak" title="Mike Kasprzak"></a> &nbsp;|&nbsp; powered by &nbsp;<a href="http://ludumdare.com" target="_blank"><img class="ludumdare" src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo40W.png" height="20" alt="Ludum Dare" title="Ludum Dare" /></a>
</div>

</body>
<?php template_GetFooter(); ?>
