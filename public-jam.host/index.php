<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/sanitize.php";

// Retrieve Action and Arguments
$arg = core_ParseActionURL();
$event = array_shift($arg);
$arg_count = count($arg);

$HIDE_FOOTER_STATS = true;

// - Styles ------------------------ //
// Color Customizing //
$dark_bg = "F32";
$light_bg = "FCB";
$dark_text = "FCB";
$light_text = "F32";

// Inverting (Logos and Colors)
$img = "W";

?>
<?php template_GetHeader(); ?>
<style>
body {
	color:#<?php echo $dark_text; ?>;
	background:#<?php echo $dark_bg; ?>;
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
.body-content {
	margin:0 auto;
	width:1024px;
}
.body span code {
	background:rgba(255,255,255,0.3);	
	padding:3px;
	margin:0 3px;
}
.footer {
	/*color:#<?php echo $dark_text; ?>;	/* TODO: Should be 80% of value (premultiplying the alpha) */
	text-align:center;
	padding:8px;
	font-variant:small-caps;
}
.footer img {
	vertical-align:middle;
	mix-blend-mode:screen;
	opacity:0.7;

	-webkit-transition:all 0.125s;
	transition:all 0.125s;
}
.footer img:hover {
	opacity:1.0;
}
.footer .mike {
	margin-bottom:4px; /* "Hair" is 4px tall, so offset the baseline for better centering */
}
</style>
<body>
	<div class="body">
		<div class="body-content">
			Body content goes here.<br /><br />
			Jam Hosting from Ludum Dare.<br /><br />
			Sorry about the loud colors, this is a stub.<br /><br /><br />
			Addon Service 2 of 3.
		</div>
	</div>	
	<div><div class="footer">
		<a href="/"><img class="jam.host" src="<?php STATIC_URL(); ?>/logo/jamhost/JamHostLogo56<?php echo $img; ?>.png" height="28" alt="JamHost" title="JamHost" /></a> by <a href="http://twitter.com/mikekasprzak" target="_blank"><img class="mike" src="<?php STATIC_URL(); ?>/logo/mike/Chicken32W.png" width="16" height="16" alt="Mike Kasprzak" title="Mike Kasprzak"></a> &nbsp;|&nbsp; powered by &nbsp;<a href="http://ludumdare.com" target="_blank"><img class="ludumdare" src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo40<?php echo $img; ?>.png" height="20" alt="Ludum Dare" title="Ludum Dare" /></a>
	</div></div>
</body>
<?php template_GetFooter(); ?>
