<?php
require_once __DIR__ . "/../web.php";
//require_once __DIR__ . "/../db.php";

const EVENT_NAME = "Ludum Dare 34";

const HTML_TITLE = "Theme Hub: ".EVENT_NAME;
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;

?>
<?php template_GetHeader(); ?>
	<div class="header">
		<div class="title">Theme Hub</div>
		<?php 
			if ( defined('EVENT_NAME') ) {
				echo "<div class='page'>";
				echo "<div class='event'>Event: <strong>".EVENT_NAME."</strong></div>";
				echo "<div class='mode'><strong>Suggestion</strong> | Slaughter | Voting | Final Voting | Announcement</div>";
				echo "</div>";
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
			
			SuggestionsLeftCount--;

			document.getElementById('suggestions-left-count').innerHTML = SuggestionsLeftCount;			
			
			document.getElementById('suggestions').innerHTML = Data.Theme + "<br />" + document.getElementById('suggestions').innerHTML;
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
			<div class="bigger"><strong>Theme Suggestion Round</strong></div>
			Round ends in: X days, 12 hours<br />
			<br />
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
		</div>
	</div>
	<br />
<?php template_GetFooter(); ?>
