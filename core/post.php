<?php
require_once __DIR__ . "/internal/emoji.php";
require_once __DIR__ . "/internal/markdown.php";

function post_Prepare($text) {
	$text = emoji_ToShort($text); 		// Convert Emoji to Short Codes
	
	$text = markdown_FromHTML($text);	// Convert HTML to Markdown and Strip Tags
	
//	$text = strip_tags($text,'<img><img/><a><br><br/><b><strong><i><em><u><p><h1><h2><h3><h4><h5><h6><blockquote><del>');
	
	// Now that all other tags are stripped, convert what remains in to 
	
	//$text = htmlspecialchars($text,ENT_HTML5);
	
	return $text;
}

?>
