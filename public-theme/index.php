<?php
require_once __DIR__."/../web.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../legacy-config.php";
require_once __DIR__."/../core/legacy_user.php";

require_once __DIR__."/../core/theme.php";
require_once __DIR__."/../core/internal/sanitize.php";

config_Load();

require_once __DIR__."/common.php";

//if ( isset($_GET['beta']) ) {
//	$DO_BETA = true;
//	$EVENT_MODE = 5;
////	$CONFIG['theme-alert'] = '<b>BETA TEST</b> • Vote data will be <b>DELETED</b> • Report bugs <a href="http://ludumdare.com/compo/">HERE</a>';
//	$CONFIG['theme-alert'] = '<b>BETA TEST</b> • Treat this as Live • Report bugs <a href="http://ludumdare.com/compo/">HERE</a>';
//}

define('HTML_TITLE',$EVENT_NAME." - Theme Hub");
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;
const HTML_USE_GOOGLE = true;

// Extract Id from Cookie (and not Announcement) //
if ( ($EVENT_MODE !== 5) && isset($_COOKIE['lusha']) ) {
	$cookie_id = legacy_GetUserFromCookie();	
}
else {
	$cookie_id = 0;
}

// Hack, only let "PoV" do admin things
$admin = false;
if ( isset($_GET['admin']) ) {
	if ( defined('LEGACY_DEBUG') || $cookie_id === 19 ) {
		$admin = true;
	}
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

const THEME_MODE_SHOW_TIMES = [
	false,
	true,
	true,
	true,
	true,
	true,
	false,
];

// ??? //
if ( isset($_GET['page']) ) {
	$page = intval($_GET['page']);
	if ( $page > 0 && $page < 5 ) {
		$EVENT_VOTE_ACTIVE = $page-1;
	}
}


require_once __DIR__."/theme-header.php";
require_once __DIR__."/theme-login.php";
require_once __DIR__."/theme-inactive.php";
require_once __DIR__."/theme-comingsoon.php";
require_once __DIR__."/theme-submitidea.php";
require_once __DIR__."/theme-stats.php";


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

require_once __DIR__."/theme-slaughter.php";
require_once __DIR__."/theme-voting.php";
require_once __DIR__."/theme-announcement.php";
require_once __DIR__."/theme-admin.php";

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
		node.setAttribute("class",'sg-item item'+((accent===true)?" effect-accent":""));
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
		
		document.getElementById('extra').classList.remove("hidden");
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
					
					if ( response.id > 0 ) {
						var el = document.getElementById('sg-item-'+response.id);
						if ( el ) {
							el.remove();
						}
						sg_UpdateCount(response.count,true);
					}
					else {
						// Invalid Response //	
					}
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
			else {
				<?php if ( $EVENT_MODE === 2 ) { ?>
					if ( event.keyCode == 37 ) {
						document.getElementById('kill-good').focus();
					}
					else if ( event.keyCode == 39 ) {
						document.getElementById('kill-bad').focus();
					}
				<?php } ?>
			}
		});

		
		
		<?php
		if ( $CONFIG['active'] && $cookie_id && !$admin ) {
		?>
			xhr_PostJSON(
				"/api-theme.php?debug",
				serialize({"action":"GETMY"}),
				// On success //
				function(response,code) {
					console.log("GETMY:",response);
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
<div class="body <?=($EVENT_MODE == 5)?'dark-body':''?>">
	<div class="main">
		<?php
			if ( $CONFIG['active'] ) {
				if ( $admin && $cookie_id ) {
					ShowAdmin();
				}
				else {					
					ShowHeadline();
	
					if ( $cookie_id == 0 && $EVENT_MODE !== 5 )	// Announcement //
						ShowLogin();
				
					switch( $EVENT_MODE ) {
					case 0:	// Inactive //
						break;
					case 1:	// Theme Suggestions //
						ShowSubmitIdea($cookie_id > 0);
						break;
					case 2: // Theme Slaughter //
						ShowSlaughter($cookie_id > 0);
						break;
					case 3: // Theme Voting //
						ShowVoting($cookie_id > 0);
						break;
					case 4: // Final Voting //
						ShowFinalVoting($cookie_id > 0);
						break;
					case 5: // Announcement //
						ShowAnnouncement();
						break;
					case 6: // Post Announcement //
						break;
					case 7: // Coming Soon //
						break;
					};
				}
			}
			else {
				ShowInactive();
			}
		?>
	</div>
	<?php
	if ( $CONFIG['active'] && ( $EVENT_MODE !== 5 ) ) {	// Announcement //
		if ( $cookie_id && !$admin ) {
			echo "<div id='extra' class='hidden'>";
				ShowMyIdeas();
				//ShowMyLikes();
			echo "</div>";
		}

		ShowStats();

		if ( $cookie_id ) {
			ShowLogout();
		}
		else {
			ShowLogin();
		}
	}
	?>
</div>
<?php template_GetFooter();
