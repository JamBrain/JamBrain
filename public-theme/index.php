<?php
require_once __DIR__ . "/../web.php";
//require_once __DIR__ . "/../db.php";

const EVENT_NAME = "Ludum Dare 34";

const HTML_TITLE = "Theme Hub: ".EVENT_NAME;
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
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
	<div class="body">
		<div class="side hide-on-mobile">
			My Suggestions:<br />
			Themes I like:<br />
		</div>
		<div class="main">
			<div class="bigger"><strong>Theme Suggestion Round</strong></div>
			Round ends in: X days, 12 hours<br />
			<br />
			<div class="big">Suggest a Theme</div>
			<form action="suggest.php">
				<input type="text" name="theme">
				<input type="submit" value="Submit"><br />
			</form>
			<small>You have <strong>10</strong> suggestions left.</small><br />
			<br />
		</div>
	</div>
	<br />
<?php template_GetFooter(); ?>
