<?php
require_once __DIR__ . "/../web.php";
//require_once __DIR__ . "/../db.php";

const EVENT_NAME = "Ludum Dare 34";

const HTML_TITLE = "Theme Hub: ".EVENT_NAME;
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;

// ** Modes ** //
// Inactive (no event scheduled)
// Suggestion (week 5-2)
// Slaughter (week 2-1)
// Voting (week 1 to 2 days)
// Final Voting 2 days to start - 30 minutes)
// Announcement (start to +3 weeks)
// Coming Soon (next event scheduled)

const THEME_MODE_NAMES = [
	"Inactive",
	"Theme Suggestion Round",
	"Theme Slaughter Round",
	"Theme Voting Round",
	"Final Round Theme Voting",
	"Theme Announcement",
	"Coming Soon"
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


function ShowMode() {
	global $active_mode;
	echo "<div class='bigger'><strong>".THEME_MODE_NAMES[$active_mode]."</strong></div>";
	echo "Round ends in: X days, 12 hours<br /><br />";
}

function ShowLogin() {
	
}
function ShowComingSoon() {
	
}
function ShowThemeSuggestion() {
?>
			<div class="big">Suggest a Theme</div>
			<input type="text" class="single-input" id="input-theme" placeholder="your suggestion" />
			<button type="button" class="submit-button" onclick="SubmitThemeForm();">Submit</button>
			<br />
			<small>You have <strong><span id="suggestions-left-count">10</span></strong> suggestion(s) left.</small><br />
			<br />
			<div class="info">
				<div class="big">My Suggestions</div><br />
				<div id="suggestions"></div>
			</div>
<?php
}

?>
<?php template_GetHeader(); ?>
	<div class="header">
		<div class="title">Theme Hub</div>
		<?php 
			if ( defined('EVENT_NAME') ) {
				echo "<div class='page'>";
				echo "<div class='event'>Event: <strong>".EVENT_NAME."</strong></div>";
				$theme_mode_count = count(THEME_MODE_SHORTNAMES);
				echo "<div class='mode'>";
				for ( $idx = 1; $idx < $theme_mode_count-1; $idx++ ) {
					if ($idx !== 1)
						echo " | ";
					if ($idx === $active_mode)
						echo "<strong>".THEME_MODE_SHORTNAMES[$idx]."</strong>";
					else
						echo THEME_MODE_SHORTNAMES[$idx];
				}
				//echo "<div class='mode'><strong>Suggestion</strong> | Slaughter | Voting | Final Voting | Announcement</div>";
				echo "</div></div>";
			}
		?>
	</div>
	<script>
		var SuggestionsLeftCount = 10;
		function SubmitThemeForm() {
			if ( SuggestionsLeftCount <= 0 )
				return;
			
			var Theme = document.getElementById('input-theme').value.trim();
			document.getElementById('input-theme').value = "";
			if ( Theme === "" )
				return;
			
			var Data = {
				"Theme":Theme
			};
			console.log(Data);
			
			// Set Loading state //
			
			
			// On success //
			SuggestionsLeftCount--;

			document.getElementById('suggestions-left-count').innerHTML = SuggestionsLeftCount;			
			
			document.getElementById('suggestions').innerHTML = Data.Theme + "<br />" + document.getElementById('suggestions').innerHTML;
			
			// On failure //
			// popup error //
		}
	</script>
	<div class="body">
<?php /*
		<div class="side hide-on-mobile">
			My Suggestions:<br />
			Themes I like:<br />
		</div>
*/ ?>
		<div class="main">
			<?php
				ShowMode();
				ShowThemeSuggestion();
			?>
		</div>
	</div>
	<br />
<?php template_GetFooter(); ?>
