<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/sanitize.php";

$HIDE_FOOTER_STATS = true;

// Modes //
const M_DEFAULT = 1;	// Default State //
const M_USER = 2;		// User Page //
const M_NO_USER = -2;	// No User Found //
const M_ERROR = -255;	// Other Error //

$mode = M_DEFAULT;

// Retrieve Action and Arguments
$arg = core_ParseActionURL();
$user_name = array_shift($arg);
$arg_count = count($arg);

// Sanitize Input
$user_name = sanitize_Slug($user_name);
if ( empty($user_name) ) {
	$mode = M_ERROR;
}
//if ( $arg_count > 0 ) {
//	$arg[0] = sanitize_Slug($arg[0]);
//	if ( empty($arg[0]) ) {
//		$mode = M_ERROR;
//	}
//}

$user = [];
$meta = [];
$config = [];
$service = [];
$back_url = "";

if ( $mode > 0 ) {
	// User Mode //
	$user = node_GetUserBySlug($user_name);
	$mode = empty($user) ? M_NO_USER : M_USER;
	
	if ( $mode === M_USER ) {
		$meta = node_GetMetasById($user['id']);
	}
}

// If Jammer metadata is set, use it as our configuration //
if ( isset($meta['tv']) ) {
	$config = &$meta['tv'];
}

// If services are set //
if ( isset($meta['twitch']) ) {
	$service['twitch'] = &$meta['twitch'];
	$service['twitch']['embed'] = '<iframe id="player" src="http://www.twitch.tv/'.$service['twitch']['name'].'/embed" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	$service['twitch']['chat'] = '<iframe src="http://www.twitch.tv/'.$service['twitch']['name'].'/chat?popout=" frameborder="0" scrolling="no"></iframe>';
	$service['twitch']['bar-height'] = 32;
	if ( !isset($config['default']) ) {
		$config['default'] = 'twitch';
	}
}
if ( isset($meta['hitbox']) ) {
	$service['hitbox'] = &$meta['hitbox'];
	$service['hitbox']['embed'] = '<iframe id="player" src="http://www.twitch.tv/'.$service['hitbox']['name'].'/embed" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	$service['hitbox']['chat'] = '<iframe src="http://www.twitch.tv/'.$service['hitbox']['name'].'/chat?popout=" frameborder="0" scrolling="no"></iframe>';
	$service['hitbox']['bar-height'] = 32;
	if ( !isset($config['default']) ) {
		$config['default'] = 'hitbox';
	}
}


// Use our real name if config tells us to //
if ( isset($user['name']) ) {
	$display_name = $user['name'];
	if ( isset($meta['real']) && isset($meta['real']['name']) ) {
		if ( isset($config['real-name']) && intval($config['real-name']) ) {
			$display_name = $meta['real']['name'] . " (" . $user['name'] . ")";
		}
	}
}


// - Styles ------------------------ //
// Color Customizing //
$dark_bg = "F32";
$light_bg = "000";
$dark_text = "FCB";
$light_text = "F32";

// Inverting (Logos and Colors)
$img = "W";

// Show the header //
$header = true;

// If Mode is valid, use Jammer settings found in user config //
if ( $mode > 0 ) {
	if ( isset($config['header']) ) {
		$header = intval($config['header']) !== 0;
	}
	
	if ( isset($config['dark-color']) ) {
		$dark_bg = $config['dark-color'];
	}
	if ( isset($config['light-color']) ) {
		$light_bg = $config['light-color'];
	}
	
	if ( isset($config['dark-text']) ) {
		$dark_text = $config['dark-text'];
	}
	else if ( isset($config['light-color']) ) {
		$dark_text = $config['light-color'];
	}

	if ( isset($config['light-text']) ) {
		$light_text = $config['light-text'];
	}
	else if ( isset($config['dark-color']) ) {
		$light_text = $config['dark-color'];
	}
}

// If in 'preview' mode, allow URL to override settings //
if ( isset($_GET['preview']) ) {
	// Allow URL to override colors //
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

	// Allow URL to override invert status //
	if ( isset($_GET['inv']) ) {
		$img = "B";
		
		$tmp = $dark_bg;
		$dark_bg = $light_bg;
		$light_bg = $tmp;
	
		$tmp = $dark_text;
		$dark_text = $light_text;
		$light_text = $tmp;
	}

	// Allow URL to override to hide header //
	if ( isset($_GET['noheader']) ) {
		$header = false;
	}
}

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
}
.body span code {
	background:rgba(255,255,255,0.3);	
	padding:3px;
	margin:0 3px;
}
.body iframe {
	display:block;
	margin:0 auto;
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
		<?php switch ($mode) { 
				  default: { ?>
				<?php echo "Unknown Error (" . $mode . ")<br />"; ?>
			<?php } break; ?>
			<?php case M_USER: { ?>
				<!--<div id="title"><?php echo $display_name . "'s home page<br />"; ?></div>-->
				<!--<?php print_r($user); ?>-->
				<!--<?php print_r($item); ?>-->		
				<?php 
					if ( isset($config['default']) ) {
						echo $service[$config['default']]['embed']; 
					}
					else {
						echo $user_name . " has not configured LDtv";
					}
				?>
			<?php } break; ?>
			<?php case M_NO_USER: { ?>
				<?php echo $user_name . " not found!<br />"; ?>
			<?php } break; ?>
		<?php }; ?>
		</div>
	</div>

	<div><div class="footer">
		<a href="/"><img class="jammer" src="<?php STATIC_URL(); ?>/logo/ldtv/LDtvLogo56<?php echo $img; ?>.png" height="28" alt="LDtv" title="LDtv" /></a> by <a href="http://twitter.com/mikekasprzak" target="_blank"><img class="mike" src="<?php STATIC_URL(); ?>/logo/mike/Chicken32W.png" width="16" height="16" alt="Mike Kasprzak" title="Mike Kasprzak"></a> &nbsp;|&nbsp; <a href="//twitter.com/jammerbio" target="_blank"><img class="jammer" src="<?php STATIC_URL(); ?>/logo/twitter/Twitter32<?php echo $img; ?>.png" height="16" alt="Twitter" title="Twitter" /></a> &nbsp;|&nbsp; powered by &nbsp;<a href="http://ludumdare.com" target="_blank"><img class="ludumdare" src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo40<?php echo $img; ?>.png" height="20" alt="Ludum Dare" title="Ludum Dare" /></a>
	</div></div>
</body>
<script>
	function ResizePlayer() {		
		var footer = document.getElementsByClassName("footer")[0];
		
		var player = document.getElementById("player");
		player.width = window.innerWidth - 32;
		player.height = window.innerHeight - 32 - footer.clientHeight;
	}
	ResizePlayer();
	window.onresize = ResizePlayer;
</script>
<?php template_GetFooter(); ?>
