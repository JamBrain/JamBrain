<?php
require_once __DIR__ . "/../web.php";
//require_once __DIR__ . "/../db.php";

const EVENT_NAME = "Ludum Dare 34";

define('HTML_TITLE',EVENT_NAME." - Theme Hub");
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;

// ** Modes ** //
const THEME_MODE_NAMES = [
	"Inactive",						// no event scheduled
	"Theme Suggestion Round",		// weeks -5 to -2
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

$active_mode = 1;


function ShowHeadline() {
	global $active_mode;
	echo "<div class='headline'>";
	echo "<div class='title bigger'><strong>".strtoupper(THEME_MODE_NAMES[$active_mode])."</strong></div>";
	echo "<div class='clock' id='headline-clock'>Round ends in <span id='headline-time'>X days, 12 hours</span></div>";
	echo "</div>";
}

function ShowLogin() {
	
}
function ShowComingSoon() {
	
}
function ShowThemeSuggestion() { ?>
	<div class="action" id="action-suggest">
		<div class="title bigger">Suggest a Theme</div>
		<div class="form">
			<input type="text" class="single-input" id="input-theme" placeholder="your suggestion" maxlength="64" />
			<button type="button" class="submit-button" onclick="SubmitThemeForm();">Submit</button>
		</div>
		<div class="footnote small">You have <strong><span id="sg-count">??</span></strong> suggestion(s) left</div>
	</div>
<?php
}
function ShowExtra() { ?>
	<div class="suggestions" id="extra-my-suggestions">
		<div class="title big">My Suggestions</div>
		<div id="suggestions"></div>
	</div>
<?php 
} ?>
<?php template_GetHeader(); ?>
<div class="header"><?php 
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

		echo "<div class='date normal inv caps' id='event-date'>Starts at <strong>9:00 PM</strong> on Friday <strong>December 11th, 2015</strong> (EST)</strong></div>";
	}
?>
</div>
<script>
	function sg_Delete(Id) {
		Id = Number(Id);
		
		var el = document.getElementById('sg-item-'+Id);
		if ( el ) {
			el.remove();
			SuggestionsLeftCount++;
			sg_UpdateCount();
		}
	}
	
	function sg_UpdateCount() {
		document.getElementById('sg-count').innerHTML = SuggestionsLeftCount;			
	}
	
	// http://stackoverflow.com/a/12562097
	function EscapeQuotes(value) {
		return String(value).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); //" // <- kill the weird quoting
	}
	
	var SuggestionsLeftCount = 10;
	function SubmitThemeForm() {
		if ( SuggestionsLeftCount <= 0 )
			return;
		
		var Theme = document.getElementById('input-theme').value.trim();
		document.getElementById('input-theme').value = "";
		if ( Theme === "" )
			return;
		
		var Data = {
			"theme":Theme
		};
		console.log(Data);
		
		xhr_PostJSON("/api-theme.php","action=SUBMIT&uid=255&theme="+Data.theme, function() {console.log("I DID IT");});
		
		// Set Loading state //
		
		var Id = SuggestionsLeftCount; // HACK
		
		// On success //
		SuggestionsLeftCount--;
		sg_UpdateCount();

		document.getElementById('suggestions').innerHTML = 
			"<div class='sg-item' id='sg-item-"+Id+"'>" +
				"<span class='sg-item-x' onclick='sg_Delete("+Id+")'>✕</span>" +
				"<span class='.sg-item-text' title='"+EscapeQuotes(Data.theme)+"'>"+Data.theme+"</span>" +
			"</div>" +
			document.getElementById('suggestions').innerHTML;
		
		// On failure //
		// popup error //
		
		document.getElementById('input-theme').focus();
	}
	
	window.onload = function() {
		sg_UpdateCount();
	}
</script>
<div class="body">
	<div class="main">
		<?php
			ShowHeadline();
			ShowThemeSuggestion();
		?>
	</div>
	<div class="extra">
		<?php
			ShowExtra();
		?>
	</div>
</div>
<?php template_GetFooter();