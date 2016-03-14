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
const HTML_USE_CORE = true;
const HTML_CSS_INCLUDE = [ 
	"/style/theme-hub.css.php",
];
const HTML_OTHER_CSS_INCLUDE = [];
const HTML_JS_INCLUDE = [];
const HTML_OTHER_JS_INCLUDE = [ 
	"api-legacy.js",
	"api-theme.js",
];
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
	<div class="sg hidden" id="extra-sg">
		<div class="title big caps space">My Suggestions</div>
		<div id="sg"></div>
	</div>
<?php 
} 
function ShowMyOldIdeas() { 
?>
	<div class="sg-old hidden" id="extra-sg-old">
		<br />
		<div class="title big caps space">Previous Suggestions</div>
		<div id="sg-old"></div>
	</div>
<?php 
}
function ShowMyLikes() { 
?>
	<div class="sg-like hidden" id="extra-sg-like">
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
require_once __DIR__."/theme-dialog.php";


template_GetPageHeader();

dialog_InsertCode();
ShowHeader();

if ( !empty($CONFIG['theme-alert']) ) {
	echo "<div class='alert'>",$CONFIG['theme-alert'],"</div>";
}
if ( isset($GLOBALS['ERROR']) ) {
	echo "<div class='alert'>",$GLOBALS['ERROR'],"</div>";
}

dialog_InsertScript();

?>
<script>
<?php
	if ( ($cookie_id === 0) && isset($GLOBALS['ERROR']) ) {
?>
		legacy_DoLogout();
<?php
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
		document.getElementById('extra-sg').classList.remove("hidden");
	}
	
	function sg_AddOldIdea(Id,Idea,accent) {
		Id = Number(Id);
		Idea = escapeString(Idea);
		IdeaAttr = escapeAttribute(Idea);
		
		var sg_root = document.getElementById('sg-old');
		
		var node = document.createElement('div');
		node.setAttribute("class",'sg-item item'+((accent===true)?" effect-accent":""));
		node.setAttribute("id","sg-item-"+Id);
		node.innerHTML = 
			"<div class='sg-item-text item-text' title='"+(Idea)+"'>"+(Idea)+"</div>";
		sg_root.insertBefore( node, sg_root.childNodes[0] );
		//sg_root.appendChild( node );
		
		document.getElementById('extra').classList.remove("hidden");
		document.getElementById('extra-sg-old').classList.remove("hidden");
	}

	function sg_RemoveIdea(Id,Idea) {
		Id = Number(Id);
		dialog_ConfirmAlert(Idea,"Are you sure you want to delete this?",function(){
			theme_RemoveIdea(Id,
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

		theme_AddIdea(Idea,
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
			theme_GetMyIdeas(
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

			theme_GetMyOtherIdeas(
				function(response,code) {
					console.log("GETMYOLD:",response);
					if ( response.hasOwnProperty('ideas') ) {
						response.ideas.forEach(function(response) {
							sg_AddOldIdea(response.id,response.theme);
						});
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
	
					// Not logged in and not an announcement //
					if ( $cookie_id == 0 && $EVENT_MODE !== 5 )
						ShowLogin();
				
					switch( $EVENT_MODE ) {
					case 0:	// Inactive //
						ShowInactive();
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
						ShowComingSoon();
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
				ShowMyOldIdeas();
				//ShowMyLikes();
			echo "</div>";
		}

		ShowStats();

		if ( $cookie_id )
			ShowLogout();
		else
			ShowLogin();
	}
	?>
</div>
<?php template_GetPageFooter();
