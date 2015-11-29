<?php
require_once __DIR__."/../web.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../legacy-config.php";
require_once __DIR__."/../core/legacy_user.php";

config_Load();

$EVENT_NAME = "Ludum Dare 34";
$EVENT_MODE = 1;
$EVENT_DATE = new DateTime("2015-12-12T02:00:00Z");

if ( isset($_GET['beta']) ) {
	$EVENT_MODE = 2;
	$CONFIG['theme-alert'] = '<b>BETA TEST</b> • Vote data will be <b>DELETED</b> • Report bugs <a href="http://ludumdare.com/compo/">HERE</a>';
}

define('HTML_TITLE',$EVENT_NAME." - Theme Hub");
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;

// Extract Id from Cookie
if ( isset($_COOKIE['lusha']) ) {
	$cookie_id = legacy_GetUserFromCookie();	
}
else {
	$cookie_id = 0;
}

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

const THEME_MODE_TIMES = [
	0,
	(2*7*24*60*60) - ((24+21)*60*60),//- (18*60*60),
	(1*7*24*60*60) - (18*60*60),
	(2*24*60*60) - (3*60*60),
	(30*60),
	0,
	0,
];

const THEME_MODE_SHOW_TIMES = [
	false,
	true,
	true,
	true,
	true,
	false,
	false,
];


// Date Hack //
$EVENT_MODE_DATE = $EVENT_DATE->getTimestamp() - THEME_MODE_TIMES[$EVENT_MODE];
$EVENT_MODE_DIFF = $EVENT_MODE_DATE - time();


function ShowHeader() {
	global $EVENT_NAME, $EVENT_MODE, $EVENT_DATE;
	if ( isset($EVENT_NAME) ) {
		echo "<div class='event bigger big-space'>Event: <strong class='caps inv' id='event-name'>".$EVENT_NAME."</strong></div>";

		echo "<div class='mode small caps'>";
		$theme_mode_count = count(THEME_MODE_SHORTNAMES);
		for ( $idx = 1; $idx < $theme_mode_count-1; $idx++ ) {
			if ($idx !== 1)
				echo " | ";
			if ($idx === $EVENT_MODE)
				echo "<strong>".strtoupper(THEME_MODE_SHORTNAMES[$idx])."</strong>";
			else
				echo strtoupper(THEME_MODE_SHORTNAMES[$idx]);
		}
		echo "</div>";
		
		echo "<div class='date normal inv caps' id='event-date' title=\"".$EVENT_DATE->format("G:i")." on ".$EVENT_DATE->format("l F jS, Y ")."(UTC)\">Starts at ".
			"<strong id='ev-time' original='".$EVENT_DATE->format("G:i")."'></strong> on ".
			"<span id='ev-day' original='".$EVENT_DATE->format("l")."'></span> ".
			"<strong id='ev-date' original='".$EVENT_DATE->format("F jS, Y")."'></strong> ".
			"(<span id='ev-zone' original='UTC'></span>)</strong></div>";
?>
		<script>
			var EventDate = new Date("<?=$EVENT_DATE->format(DateTime::W3C)?>");

			dom_SetText( 'ev-time', getLocaleTime(EventDate) );
			dom_SetText( 'ev-day', getLocaleDay(EventDate) );
			dom_SetText( 'ev-date', getLocaleDate(EventDate) );
			dom_SetText( 'ev-zone', getLocaleTimeZone(EventDate) );
		</script>
<?php
	}
}

function ShowHeadline() {
	global $EVENT_MODE;

	$UTCDate = date(DATE_RFC850,$GLOBALS['EVENT_MODE_DATE']);
?>
	<div class='headline'>
		<div class='title bigger caps space inv soft-shadow'><strong><?=THEME_MODE_NAMES[$EVENT_MODE]?></strong></div>
<?php
	if ( THEME_MODE_SHOW_TIMES[$EVENT_MODE] ) {
?>
		<div class='clock' id='headline-clock'>Round ends in <span id='headline-time' title="<?=$UTCDate?>"></span></div>
		<script>
			var _SERVER_TIME_DIFF = <?=$GLOBALS['EVENT_MODE_DIFF']?>;
			var _LOCAL_TIME = Date.now();
			
			function UpdateRoundClock() {
				var LocalTimeDiff = Date.now() - _LOCAL_TIME;
				var TotalTimeDiff = _SERVER_TIME_DIFF - Math.ceil(LocalTimeDiff*0.001);
				if (TotalTimeDiff > 0) {
					dom_SetText('headline-time',getCountdownInWeeks(TotalTimeDiff,3,true));
					if ( TotalTimeDiff <= (24*60*60) )
						time_CallNextSecond(UpdateRoundClock);
					else
						time_CallNextMinute(UpdateRoundClock);
				}
				else {
					dom_SetText('headline-clock',"Round has ended. The next Round will begin soon.");
				}
			}
			UpdateRoundClock();
		</script>
<?php
	}
?>
	</div>
<?php
}

function ShowLogin() {
?>
	<div class="action" id="action-login">
		<a href="<?=LEGACY_LOGIN_URL?>"><button type="button" class="login-button">Login</button></a>
	</div>	
<?php
}
function ShowLogout() {
?>
	<div class="action" id="action-logout">
		<button type="button" class="login-button" onclick="DoLogout(true)">Logout</button>
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
function ShowSubmitIdea() { 
	if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {
?>
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
}
function ShowMyStats() { 
?>
	<div class="sg-stats" id="extra-sg-stats">
		<div class="title big caps space">Stats</div>
		<div id="sg-stats">
			<div>My votes: ?</div>
			<?php /*<div>My total votes: ?</div>*/ ?>
			<div>Total votes: ?</div>
			<?php /*<div>All votes: ?</div>*/ ?>
		</div>
	</div>
<?php 
} 
function ShowMyIdeas() { 
?>
	<div class="sg" id="extra-sg">
		<div class="title big caps space">My Suggestions</div>
		<div id="sg"></div>
	</div>
<?php 
} 
function ShowMyLikes() { 
?>
	<div class="sg-like" id="extra-sg-like">
		<br />
		<div class="title big caps space">Suggestions I Like</div>
		<div id="sg-like"></div>
	</div>
<?php 
}
function ShowSlaughter() {
?>
	<div class="action" id="action-kill">
		<div class="kill-group">
			<div class="title bigger" id="kill-theme">?</div>
		</div>
			<button id="kill-good" class="bigger green_button" onclick='kill_VoteIdea(1)' title='Good'>✓</button>
			<button id="kill-bad" class="bigger red_button" onclick='kill_VoteIdea(0)' title='Bad'>❌</button>
	
			<button id="kill-flag" class="bigger yellow_button" onclick='kill_FlagIdea()' title='Flag Innapropriate'>⚑</button>
		<div>
			<button id="kill-cancel" class="normal" onclick='' title=''>Cancel Edit</button>
		</div>
			<?php /*<div id="kill-star" class="bigger" onclick='' title='Star It'>★</div>*/ ?>
			<?php /*<div id="kill-love" class="bigger" onclick='' title='Love It'>❤</div>*/ ?>
		
		<div class="title big" id="kill-theme">Previous Themes</div>
		<div class="" id="kill"></div>
		
		<script>
			var _LastSlaughterResponse = null;
			function GetTheme() {
				xhr_GetJSON(
					"/api-theme.php?action=RANDOM",
					// On success //
					function(response,code) {
						_LastSlaughterResponse = response;
						dom_SetText('kill-theme',response.theme);
					}
				);
			}
			GetTheme(); // Call it!! //

			function kill_AddTheme( action, accent ) {
				var Id = _LastSlaughterResponse.id;
				var Theme = escapeString(_LastSlaughterResponse.theme);
				var ThemeAttr = escapeAttribute(_LastSlaughterResponse.theme);

				var kill_root = document.getElementById('kill');
				
				var node = document.createElement('div');
				node.setAttribute("class",'kill-item'+((accent===true)?" effect-accent":""));
				node.setAttribute("id","kill-item-"+Id);


//				node.innerHTML = 
//					"<div class='sg-item-x' onclick='kill_RemoveTheme("+Id+",\""+(ThemeAttr)+"\")'>❤</div>";
				switch( action ) {
				case 1:
					node.innerHTML += "<div class='item-left item-good' title='Good'>✓</div>";
					break;
				case 0:
					node.innerHTML += "<div class='item-left item-bad' title='Bad'>❌</div>";
					break;
				case -1:
					node.innerHTML += "<div class='item-left item-flag' title='Flag'>⚑</div>";
					break;
				};
				node.innerHTML +=
					"<div class='kill-item-text item-text' title='"+(Theme)+"'>"+(Theme)+"</div>";
				
				kill_root.insertBefore( node, kill_root.childNodes[0] );
							
				GetTheme();
			}
			
			function kill_VoteIdea(Value) {
				Value = Number(Value);
				xhr_PostJSON(
					"/api-theme.php",
					serialize({"action":"IDEA","id":_LastSlaughterResponse.id,"value":Value}),
					// On success //
					function(response,code) {
						console.log("IDEA:",response);
						kill_AddTheme(Value,true);
						//kill_UpdateCount(response.count,true);
					}
				);
			}
			function kill_FlagIdea() {
				var Idea = _LastSlaughterResponse.theme;
				dialog_ConfirmAlert(Idea,"Are you sure you want to Flag this as inappropriate?",function(){
					xhr_PostJSON(
						"/api-theme.php",
						serialize({"action":"IDEA","id":_LastSlaughterResponse.id,"value":-1}),
						// On success //
						function(response,code) {
							console.log("IDEA:",response);
							kill_AddTheme(-1,true);
							//kill_UpdateCount(response.count,true);
						}
					);
				});	
			}
		</script>
	</div>
<?php 
	
//	$ideas = theme_GetOriginalIdeas();
//	print_r($ideas);
}
?>
<?php template_GetHeader(); ?>
<div class="invisible" id="dialog-back" onclick='dialog_Close();'>
	<div id="dialog" onclick="event.stopPropagation();">
		<div class="title big" id="dialog-title">Title</div>
		<div class="body">
			<div><img id="dialog-img" src="<?=CMW_STATIC_URL?>/external/emojione/assets/png/26A0.png?v=1.2.4" width=64 height=64"></div>
			<div id="dialog-text">Text</div>
		</div>
		<a href="#" id="dialog-focusfirst"></a>
		<div class="buttons hidden" id="dialog-yes_no">
			<button id="dialog-yes" class="normal focusable" onclick='dialog_DoAction();'>Yes</button>
			<button id="dialog-no" class="normal focusable" onclick='dialog_Close();'>No</button>
		</div>
		<div id="dialog-ok_only" class="buttons hidden">
			<button id="dialog-ok" class="normal focusable" onclick='dialog_Close();'>OK</button>
		</div>
		<a href="#" id="dialog-focuslast"></a>
	</div>
</div>
<div class="header"><?php
	ShowHeader();
?>
</div>
<?php
	if ( !empty($CONFIG['theme-alert']) ) {
		echo "<div class='alert'>",$CONFIG['theme-alert'],"</div>";
	}
	if ( isset($GLOBALS['ERROR']) ) {
		echo "<div class='alert'>",$GLOBALS['ERROR'],"</div>";
	}
?>
<script>
	function DoLogout( reload ) {
		xhr_PostJSON(
			"/api-legacy.php",
			serialize({"action":"LOGOUT"}),
			// On success //
			function(response,code) {
				console.log(response);
				if ( reload ) {
					location.reload();
				}
			}
		);			
	}
	
<?php
	if ( ($cookie_id === 0) && isset($GLOBALS['ERROR']) ) {
		echo "DoLogout();";
	}
?>
	
	function sg_AddIdea(Id,Idea,accent) {
		Id = Number(Id);
		Idea = escapeString(Idea);
		IdeaAttr = escapeAttribute(Idea);
		
		var sg_root = document.getElementById('sg');
		
		var node = document.createElement('div');
		node.setAttribute("class",'sg-item'+((accent===true)?" effect-accent":""));
		node.setAttribute("id","sg-item-"+Id);
<?php 	if ( $EVENT_MODE === 1 && ($GLOBALS['EVENT_MODE_DIFF'] > 0) ) {	?>
			node.innerHTML = 
				"<div class='sg-item-x' onclick='sg_RemoveIdea("+Id+",\""+(IdeaAttr)+"\")'>✕</div>" +
				"<div class='sg-item-text item-text' title='"+(Idea)+"'>"+(Idea)+"</div>";
<?php	} else { ?>
			node.innerHTML = 
				"<div class='sg-item-text item-text' title='"+(Idea)+"'>"+(Idea)+"</div>";
<?php	} ?>
		sg_root.insertBefore( node, sg_root.childNodes[0] );
		//sg_root.appendChild( node );
	}

	function sg_RemoveIdea(Id,Idea) {
		Id = Number(Id);
		dialog_ConfirmAlert(Idea,"Are you sure you want to delete this?",function(){
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
					sg_UpdateCount(response.count,true);
				}
			);
		});
	}
	
	function sg_UpdateCount(count,effect) {
		var el = document.getElementById('sg-count');
		var Total = 3 - count;
		if ( el && Number(el.innerHTML) !== Total ) {
			el.innerHTML = Total;
			if ( effect === true ) {
				dom_RestartAnimation('sg-count','effect-accent');
			}
		}
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
				
				sg_UpdateCount(response.count,true);
				
				// Success //
				if ( response.id > 0 ) {
					sg_AddIdea(response.id,response.idea,true);
				}
				// Failure //
				else if ( response.count === 3 ) {
					elm.value = Idea;	// Restore
					dialog_Alert("No Suggestions Left","");
				}
				else {
					dialog_Alert("Other Error",JSON.stringify(response));
				}
			}
		);

		elm.focus();
	}
	
	function dialog_ConfirmAlert(title,message,func /*,outside_close*/) {
		if ( dialog_IsActive() )
			return;
		
		dialog_SetAction(func);
		dom_SetText("dialog-title",title);
		dom_SetText("dialog-text",message);
		
		dom_ToggleClass("dialog-yes_no","hidden",false);
		dom_ToggleClass("dialog-ok_only","hidden",true);
		
		dom_SetClasses("dialog","red_dialog effect-zoomin");
		dom_SetClasses("dialog-back","effect-fadein");

		dom_SetFocus("dialog-no");
	}
	function dialog_Alert(title,message /*,outside_close*/) {
		if ( dialog_IsActive() )
			return;
		
		dom_SetText("dialog-title",title);
		dom_SetText("dialog-text",message);

		dom_ToggleClass("dialog-yes_no","hidden",true);
		dom_ToggleClass("dialog-ok_only","hidden",false);
		
		dom_SetClasses("dialog","blue_dialog effect-zoomin");
		dom_SetClasses("dialog-back","effect-fadein");
		
		dom_SetFocus("dialog-ok");
	}
	var _dialog_action;
	function dialog_SetAction(func) {
		_dialog_action = func;
	}
	function dialog_DoAction() {
		_dialog_action();		
		dialog_Close();
	}
	function dialog_IsActive() {
		return dom_HasClass("dialog-back","effect-fadein");
	}
	function dialog_Close() {
		dom_RemoveClass("dialog","effect-zoomin");
		dom_AddClass("dialog","effect-zoomout");
		dom_SetClasses("dialog-back","effect-fadeout");
	}
	
	window.onload = function() {
		// Dialog //
		var Focusable = document.getElementsByClassName("focusable");
		
		// NOTE: If you tab in from the title bar, the last element will be selected
		document.getElementById("dialog-focusfirst").addEventListener("focus",function(event){
			for ( var idx = Focusable.length-1; idx >= 0; idx-- ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		document.getElementById("dialog-focuslast").addEventListener("focus",function(event){
			for ( var idx = 0; idx < Focusable.length; idx++ ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		// For browsers that do otherwise //
		window.addEventListener("focus",function(event){
			for ( var idx = Focusable.length-1; idx >= 0; idx-- ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		
		window.addEventListener("keydown",function(event){
			if ( dialog_IsActive() ) {
				if ( event.keyCode == 27 ) {
					// TODO: Confirm that we are in a mode where pushing ESC is allowed
					event.preventDefault();
					event.stopPropagation();
					dialog_Close();
				}
			}
		});

		
		
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
						
						sg_UpdateCount(response.count);
					}
					else {
						sg_UpdateCount("ERROR",true);
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
					switch( $EVENT_MODE ) {
					case 0:	// Inactive //
						break;
					case 1:	// Theme Suggestions //
						ShowSubmitIdea();
						break;
					case 2: // Theme Slaughter //
						ShowSlaughter();
						break;
					case 3: // Theme Voting //
						break;
					case 4: // Final Voting //
						break;
					case 5: // Announcement //
						break;
					case 6: // Post Announcement //
						break;
					case 7: // Coming Soon //
						break;
					};
					
					if ( $EVENT_MODE !== 5 ) {	// Announcement //
						ShowLogout();
					}
				}
				else {
					if ( $EVENT_MODE !== 5 ) { // Announcement //
						ShowLogin();
					}
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
				ShowMyIdeas();
				//ShowMyLikes();
				//ShowMyStats();
				echo "</div>";
			}
		}
	?>
</div>
<?php template_GetFooter();
