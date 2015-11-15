<?php
require_once __DIR__."/../web.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../legacy-config.php";

const EVENT_NAME = "Ludum Dare 34";

define('HTML_TITLE',EVENT_NAME." - Theme Hub");
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;


// Extract Id from Cookie
if ( isset($_COOKIE['lusha']) )
	$cookie_id = intval(explode('.',$_COOKIE['lusha'],2)[0]);
else
	$cookie_id = 0;


// ** Modes ** //
const THEME_MODE_NAMES = [
	"Inactive",						// no event scheduled
	"Theme Suggestion Round",		// weeks -5 to -2 (AKA: Ideas)
	"Theme Slaughter Round",		// weeks -2 to -1
	"Theme Voting Round",			// week -1 to day -2
	"Final Round Theme Voting",		// day -2 to start -30 minutes
	"Theme Announcement",			// start
	"Coming Soon"					// week +3 (next event scheduled)
];

const THEME_MODE_SHORTNAMES = [
	"Inactive",
	"Suggestion",
	"Slaughter",
	"Voting",
	"Final Voting",
	"Announcement",
	"Coming Soon"
];

config_Load();

$active_mode = 1;

function ShowHeader() {
	global $active_mode;
	if ( defined('EVENT_NAME') ) {
		echo "<div class='event big inv'>Event: <strong class='caps' id='event-name'>".EVENT_NAME."</strong></div>";

		echo "<div class='mode small caps'>";
		$theme_mode_count = count(THEME_MODE_SHORTNAMES);
		for ( $idx = 1; $idx < $theme_mode_count-1; $idx++ ) {
			if ($idx !== 1)
				echo " | ";
			if ($idx === $active_mode)
				echo "<strong>".THEME_MODE_SHORTNAMES[$idx]."</strong>";
			else
				echo THEME_MODE_SHORTNAMES[$idx];
		}
		echo "</div>";

		echo "<div class='date normal inv caps' id='event-date'>Starts at <strong id='ev-time'>9:00 PM</strong> on <span id='ev-day'>Friday</span> <strong id='ev-date'>December 11th, 2015</strong> (<span id='ev-zone'>EST</span>)</strong></div>";
	}
}

function ShowHeadline() {
	global $active_mode;
	echo "<div class='headline'>";
	echo "<div class='title bigger'><strong>".strtoupper(THEME_MODE_NAMES[$active_mode])."</strong></div>";
	
	// Date Hack //
	$EventDate = strtotime("2015-12-12T02:00:00Z");
	$TargetDate = $EventDate - (2*7*24*60*60) - (6*60*60);
	$DateDiff = $TargetDate - time();
	
	$SEC = $DateDiff % 60;
	$MIN = ($DateDiff / 60) % 60;
	$HOUR = ($DateDiff / (60*60)) % 24;
	$DAY = ($DateDiff / (60*60*24)) % 7;
	$WEEK = floor($DateDiff / (60*60*24*7));
	
	$OutTime = "";
	if ( $WEEK > 0 ) {
		if ( $WEEK > 1 )
			$OutTime .= $WEEK." weeks";
		else if ( $WEEK == 1 )
			$OutTime .= $WEEK." week";
	}

	if ( $DAY > 0 ) {
		if ( !empty($OutTime) )
			$OutTime .= ", ";
		if ( $DAY > 1 )
			$OutTime .= $DAY." days";
		else if ( $DAY == 1 )
			$OutTime .= $DAY." day";
	}

	if ( $HOUR > 0 ) {
		if ( !empty($OutTime) )
			$OutTime .= ", ";
		if ( $HOUR > 1 )
			$OutTime .= $HOUR." hours";
		else if ( $HOUR == 1 )
			$OutTime .= $HOUR." hour";
	}
	
	$UTCDate = date(DATE_RFC850,$TargetDate);

	echo "<div class='clock' id='headline-clock'>Round ends in <span id='headline-time' title=\"".$UTCDate."\">".$OutTime."</span></div>";
	echo "</div>";
}

function ShowLogin() {
?>
	<div class="action" id="action-login">
		<a href="<?= LEGACY_LOGIN_URL ?>"><button type="button" class="submit-button">Login</button></a>
	</div>	
<?php
}
function ShowLogout() {
?>
	<div class="action" id="action-logout">
		<button type="button" class="submit-button" onclick="DoLogout()">Logout</button>
	</div>	
<?php
}
function ShowInactive() { ?>
	<div class='headline no-margin'>
		<div class="title bigger"><strong>BE RIGHT BACK!</strong></div>
		<div>We're just fixing things. Give us a moment. Fixy fixy!</div>
		<br />
		<div id="twitter-widget">
			<a class="twitter-timeline" data-dnt="true" href="https://twitter.com/ludumdare" data-widget-id="665760712757657600">Tweets by @ludumdare</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
      	</div>
	</div><?php
}


function ShowComingSoon() {
	
}
function ShowSubmitIdea() { ?>
	<div class="action" id="action-idea">
		<div class="title bigger">Suggest a Theme</div>
		<div class="form">
			<input type="text" class="single-input" id="input-idea" placeholder="Your suggestion" maxlength="64" />
			<button type="button" class="submit-button" onclick="SubmitIdeaForm();">Submit</button>
		</div>
		<div class="footnote small">You have <strong><span id="sg-count">?</span></strong> suggestion(s) left</div>
		<script>
			document.getElementById("input-idea").addEventListener("keydown", function(e) {
				if (!e) { var e = window.event; }
				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
			}, false);
		</script>
	</div>
<?php
}
function ShowExtra() { ?>
	<div class="sg" id="extra-sg">
		<div class="title big">My Suggestions</div>
		<div id="sg"></div>
	</div>
<?php 
} ?>
<?php template_GetHeader(); ?>
<div class="header"><?php
	ShowHeader();
?>
</div>
<?php
	if ( !empty($CONFIG['theme-alert']) ) {
		echo "<div class='alert caps'>",$CONFIG['theme-alert'],"</div>";
	}
?>
<script>
	function DoLogout() {
		xhr_PostJSON(
			"/api-legacy.php",
			serialize({"action":"LOGOUT"}),
			// On success //
			function(response,code) {
				console.log(response);
				location.reload();
			}
		);			
	}
	
	function sg_AddIdea(Id,Idea) {
		Id = Number(Id);
		Idea = escapeString(Idea);
		IdeaAttr = escapeAttribute(Idea);
		document.getElementById('sg').innerHTML = 
			"<div class='sg-item' id='sg-item-"+Id+"'>" +
				"<div class='sg-item-x' onclick='sg_RemoveIdea("+Id+",\""+(IdeaAttr)+"\")'>✕</div>" +
				"<div class='sg-item-text' title='"+(Idea)+"'>"+(Idea)+"</div>" +
			"</div>" +
			document.getElementById('sg').innerHTML;
	}

	function sg_RemoveIdea(Id,Idea) {
		Id = Number(Id);
		if ( window.confirm(Idea+"\n\nAre you sure you want to delete this?") ) {
			xhr_PostJSON(
				"/api-theme.php",
				serialize({"action":"REMOVE","id":Id}),
				// On success //
				function(response,code) {
					console.log("REMOVE:",response);
					var el = document.getElementById('sg-item-'+response.id);
					if ( el ) {
						el.remove();
					}
					sg_UpdateCount(response.ideas_left);
				}
			);
		}
	}
	
	function sg_UpdateCount(count) {
		document.getElementById('sg-count').innerHTML = count;			
	}
		
	function SubmitIdeaForm() {
		var elm = document.getElementById('input-idea');
		var Idea = elm.value.trim();
		
		if ( Idea === "" )
			return;

		elm.value = "";

		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"ADD","idea":Idea}),
			// On success //
			function(response,code) {
				console.log("ADD:",response);
				
				response.id = Number(response.id);
				response.ideas_left = Number(response.ideas_left);
				
				sg_UpdateCount(response.ideas_left);
				
				// Success //
				if ( response.id > 0 ) {
					sg_AddIdea(response.id,response.idea);
				}
				// Failure //
				else if ( response.ideas_left === 0 ) {
					elm.value = Idea;	// Restore
					alert("Out of Suggestions");
				}
				else {
					alert("Other Error "+print_r(response));
				}
			}
		);

		elm.focus();
	}
	
	window.onload = function() {
	<?php
	if ( $CONFIG['active'] && $cookie_id ) {
	?>
		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"GET"}),
			// On success //
			function(response,code) {
				console.log("GET:",response);
				if ( response.hasOwnProperty('ideas') ) {
					response.ideas.forEach(function(response) {
						sg_AddIdea(response.id,response.theme);
					});
					
					sg_UpdateCount(response.ideas_left);
				}
				else {
					sg_UpdateCount("ERROR");
				}
			}
		);
	<?php
	}
	?>
	}
</script>
<div class="body">
	<div class="main">
		<?php
			if ( $CONFIG['active'] ) {
				ShowHeadline();
				if ( $cookie_id ) {
					ShowSubmitIdea();
					ShowLogout();
				}
				else {
					ShowLogin();
				}
			}
			else {
				ShowInactive();
			}
		?>
	</div>
	<?php
		if ( $CONFIG['active'] ) {
			if ( $cookie_id ) {
				echo "<div class='extra'>";
				ShowExtra();
				echo "</div>";
			}
		}
	?>
</div>
<?php template_GetFooter();