<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/sanitize.php";
require_once __DIR__ . "/../core/schedule.php";

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
	$service['twitch']['chat'] = '<iframe id="chat" src="http://www.twitch.tv/'.$service['twitch']['name'].'/chat?popout=" frameborder="0" scrolling="no"></iframe>';
	if ( !isset($config['default']) ) {
		$config['default'] = 'twitch';
	}
}
if ( isset($meta['youtube']) ) {
	$service['youtube'] = &$meta['youtube'];
	// TODO: Fetch stream id internal data //
	$service['youtube']['stream'] = "Y7YHCaVePtE";
	$service['youtube']['embed'] = '<iframe id="player" src="//www.youtube.com/embed/'.$service['youtube']['stream'].'?rel=0&autoplay=1&controls=0" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'youtube';
	}
}
if ( isset($meta['hitbox']) ) {
	$service['hitbox'] = &$meta['hitbox'];
	$service['hitbox']['embed'] = '<iframe id="player" src="http://www.hitbox.tv/embed/'.$service['hitbox']['name'].'?autoplay=true" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	$service['hitbox']['chat'] = '<iframe id="chat" src="http://www.hitbox.tv/embedchat/'.$service['hitbox']['name'].'?autoconnect=true" frameborder="0" scrolling="no"></iframe>';
	$service['hitbox']['chatwidth'] = 300;
	if ( !isset($config['default']) ) {
		$config['default'] = 'hitbox';
	}
}
if ( isset($meta['beam']) ) {
	$service['beam'] = &$meta['beam'];
	$service['beam']['embed'] = '<iframe id="player" src="https://beam.pro/embed/player/'.$service['beam']['name'].'" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	$service['beam']['chat'] = '<iframe id="chat" src="https://beam.pro/embed/chat/'.$service['beam']['name'].'" frameborder="0" scrolling="no"></iframe>';
	if ( !isset($config['default']) ) {
		$config['default'] = 'beam';
	}
}
// Not actually embedded, but their weird popout player 
if ( isset($meta['picarto']) ) {
	$service['picarto'] = &$meta['picarto'];
	$service['picarto']['embed'] = '<iframe id="player" src="https://picarto.tv/live/playerpopout.php?popit='.$service['picarto']['name'].'&off=1&token=0" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'picarto';
	}
}
// livecoding.tv DOESN'T EVEN SUPPORTE EMBEDDING!?
//if ( isset($meta['livecoding']) ) {
//	$service['livecoding'] = &$meta['livecoding'];
//	$service['livecoding']['embed'] = '<iframe id="player" src="https://beam.pro/embed/player/'.$service['livecoding']['name'].'" frameborder="0" scrolling="no" allowfullscreen></iframe>';
//	$service['livecoding']['chat'] = '<iframe id="chat" src="https://beam.pro/embed/chat/'.$service['livecoding']['name'].'" frameborder="0" scrolling="no"></iframe>';
//	if ( !isset($config['default']) ) {
//		$config['default'] = 'livecoding';
//	}
//}
if ( isset($meta['mlg']) ) {
	$service['mlg'] = &$meta['mlg'];
	$service['mlg']['embed'] = '<iframe id="player" src="http://tv.majorleaguegaming.com/player/embed/'.$service['mlg']['name'].'" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'mlg';
	}
}
if ( isset($meta['azubu']) ) {
	$service['azubu'] = &$meta['azubu'];
	$service['azubu']['embed'] = '<iframe id="player" src="http://www.azubu.tv/azubulink/embed='.$service['azubu']['name'].'" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'azubu';
	}
}
if ( isset($meta['ustream']) ) {
	$service['ustream'] = &$meta['ustream'];
	$service['ustream']['embed'] = '<iframe id="player" src="http://www.ustream.tv/embed/'.$service['ustream']['id'].'?v=3&wmode=direct&autoplay=true" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'ustream';
	}
}
if ( isset($meta['livestream']) ) {
	$service['livestream'] = &$meta['livestream'];
	// TODO: Figure this out via tracking
	$service['livestream']['event'] = "4194793";
	$service['livestream']['embed'] = '<iframe id="player" src="http://livestream.com/accounts/'.$service['livestream']['id'].'/events/'.$service['livestream']['event'].'/player?autoPlay=true&mute=false" frameborder="0" scrolling="no" allowfullscreen></iframe>';
	// No Chat Embed //
	if ( !isset($config['default']) ) {
		$config['default'] = 'livestream';
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
$dark_bg = "545";
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

function GravatarHash($mail) {
	return md5(strtolower(trim( $mail )));
}

?>
<?php template_GetHeader(); ?>
<style>
body {
	color:#<?php echo $dark_text; ?>;
	background:#<?php echo $dark_bg; ?>;
	overflow:hidden;
}
a {
	color:#<?php echo $dark_text; ?>;
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
	padding:0;
	/*padding-top:16px;*/
	/*padding-bottom:16px;*/
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
	line-height:28px;
}
.footer img {
	vertical-align:middle;
	mix-blend-mode:screen;
	/*opacity:0.7;*/

	/*-webkit-transition:all 0.125s;*/
	/*transition:all 0.125s;*/
}
.footer img:hover {
	/*opacity:1.0;*/
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
						// If chat is enabled and is available in this streaming method //
						if (isset($config['chat']) && isset($service[$config['default']]['chat'])) {
							$chat_layout = intval($config['chat']);
							if ( $chat_layout > 0 ) {
								echo ($chat_layout === 1 ? "<div style='float:right'>" : "<div style='float:left'>");
								echo $service[$config['default']]['chat'];
								echo "</div>";
							}
						}
						echo "<div>";
						echo $service[$config['default']]['embed'];
						echo "</div>";
					}
					else {
						echo "<div>";
						echo $user_name . " has not configured LDtv";
						echo "</div>";
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
		<?php
			$subscription = schedule_GetSubscriptionsByUserIds($user['id']);
			$current_event;
			
			if ( count($subscription) ) {
				$active = schedule_GetActiveParentsByIds();
				
				$event_ids = [];
				foreach ( $subscription as &$event ) {
					foreach ( $active as $key => &$value ) {
						if ( $event === $value ) {
							$event_ids[] = $key;
						}
						else if ( $event === $key ) {
							$event_ids[] = $key;
						}
					}
				}
				//print_r($event_ids);
				
				$events = schedule_GetByIds( $event_ids );

				$current_event = array_pop($events);
				foreach ( $events as &$event ) {
					if ( $current_event['priority'] > $event['priority'] ) {
						$current_event = &$event;
					}
				}
				// NOTE: First highest priority event we come across will get selected
			}
		?>
		<div style="float:left;line-height:28px;"><?php
			echo '<img src="http://www.gravatar.com/avatar/'.GravatarHash( $user_name==="pov"?"mike@sykhronics.com":"banana@what.de" ).'?s=56" width="28" height="28" />';
			echo '<a href="//ludumdare.com/user/'.$user_name.'" target="_blank" title="'.$user_name.'" alt="'.$user_name.'" >'.$display_name.'</a>';

			if (isset($meta['twitter'])) {
				echo ' | <a href="//twitter.com/'.($meta['twitter']).'" target="_blank"><img src="'.CMW_STATIC_URL.'/logo/twitter/Twitter32'.$img.'.png" height="16" alt="'.($meta['twitter']).'" title="'.($meta['twitter']).'" /></a>';
			}

			// NOTE: Reminders are a star for the item you are working on. If not participating, no reminder.
			echo " | +love | +follow";
			
			global $current_event;
			if ( $current_event ) {
				echo " | +add reminder";
			}
			?>
		</div>
		<div style="float:right">
			<div id="tools" style="display:inline-block;"></div>
			<a href="/"><img class="jammer" src="<?php STATIC_URL(); ?>/logo/jammer/JammerLogo56<?php echo $img; ?>.png" height="28" alt="Jammer" title="Jammer" /></a>
		</div>
		<div>&nbsp;
		<?php
			global $current_event;
			if ( $current_event ) {
				echo "<strong>";
				echo $current_event['name'];
				echo "</strong>";
				
				if ( isset($current_event['extra']['countdown']) ) {
					echo " ends in";
				
					$time_now = time();
					$time_end = $current_event['end'];
					$time = $time_end - $time_now;
					
					$seconds = floor($time) % 60;
					$minutes = floor($time / 60) % 60;
					$hours = floor($time / (60*60)) % 24;
					$days = floor($time / (60*60*24));
					echo  "" . ($days ? (" ".$days." days, ") : "") .
						" " . str_pad($hours,2,'0') . ":" . str_pad($minutes,2,'0') . ":" . str_pad($seconds,2,'0');
				}

				if ( isset($current_event['extra']['theme']) ) {
					echo " | Theme: <strong>";
					echo $current_event['extra']['theme'];
					echo "</strong>";
				}
			}
			else {
				echo "&nbsp;";
			}
		?>
		</div>
	</div></div>
</body>
<script>
	function ResizePlayer() {		
		var footer = document.getElementsByClassName("footer")[0];

		var ChatWidth = 0;
		var FixedChatWidth = <?php echo isset($service[$config['default']]['chatwidth']) ? $service[$config['default']]['chatwidth'] : 0; ?>;
		
		var chat = document.getElementById("chat");
		if ( chat ) {
			ChatWidth = Math.floor(window.innerWidth*0.20);
			if ( ChatWidth < 100 ) {
				// Disable //
			}
			if ( FixedChatWidth ) {
				ChatWidth = FixedChatWidth;
			}
			chat.width = ChatWidth;
			chat.height = window.innerHeight - footer.clientHeight;
		}
		
		var player = document.getElementById("player");
		player.width = window.innerWidth - ChatWidth;
		player.height = window.innerHeight - footer.clientHeight;
	}
	ResizePlayer();
	window.onresize = ResizePlayer;
	
	
	// http://www.sitepoint.com/use-html5-full-screen-api/
	
	function CanFullScreen() {
		return document.fullscreenEnabled || 
		    document.webkitFullscreenEnabled || 
		    document.mozFullScreenEnabled ||
		    document.msFullscreenEnabled;
	}
	function IsFullScreen() {
		return document.fullscreenElement ||
		    document.webkitFullscreenElement ||
		    document.mozFullScreenElement ||
		    document.msFullscreenElement;
	}
	function SetFullScreen(el) {
		if (el.requestFullscreen)
			el.requestFullscreen();
		else if (el.webkitRequestFullscreen)
			el.webkitRequestFullscreen();
		else if (el.mozRequestFullScreen)
			el.mozRequestFullScreen();
		else if (el.msRequestFullscreen)
			el.msRequestFullscreen();		
	}
	function ExitFullScreen() {
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.msExitFullscreen)
			document.msExitFullscreen();
	}
	function ToggleFullScreen() {
		if ( IsFullScreen() ) {
			ExitFullScreen();
		}
		else {
			SetFullScreen( document.documentElement );
		}
	}
	if ( CanFullScreen() ) {
		var tools = document.getElementById("tools");
		var el = document.createElement("div");
		el.addEventListener('click',ToggleFullScreen,false);
		el.appendChild( document.createTextNode("[ FULL ]") );
		tools.appendChild(el);
	}
</script>
<?php template_GetFooter(); ?>
