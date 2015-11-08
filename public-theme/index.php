<?php
require_once __DIR__ . "/../web.php";
//require_once __DIR__ . "/../db.php";

const EVENT_NAME = "Ludum Dare 34";

const HTML_TITLE = "Theme Hub: ".EVENT_NAME;
const HTML_CSS_INCLUDE = [
	"/style/theme-hub.css.php"
];
const HTML_SHOW_FOOTER = true;

?>
<?php template_GetHeader(); ?>
	<h2>Theme Hub</h2>
	<?php 
		if ( defined('EVENT_NAME') ) {
			echo "Event: ".EVENT_NAME."<br />";
		}
	?>
	<strong>Suggestion</strong> | Slaughter | Voting | Final Voting | Announcement<br />
	<strong>Theme Suggestion Round</strong>. Round ends in: X days, 12 hours<br />
	You have X suggestions left.<br />
	Suggest a Theme:<br />
	<form action="suggest.php">
		<input type="text" name="theme">
		<input type="submit" value="Submit"><br />
	</form>
	My Theme Suggestions:<br />
	Themes I like:<br />
<?php template_GetFooter(); ?>
