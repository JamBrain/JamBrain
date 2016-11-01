<?php
/** @file html.php
*	@brief Support library for emitting HTML (typically for making Web pages)
**/

include_once __DIR__ . "/../../config.php";


function html_ParseText( $text ) {
	$text = trim($text);
	$blocks = explode('```',$text);
	$out = "";
	foreach($blocks as $key => $block) {
		// Odd: Wrap in a code tag //
		if ( $key & 1 ) {
			$out .= "<span class='code' style='font-family:monospace;white-space:pre;text-align:left;display:inline-block;border:1px solid rgba(0,0,0,0.2);padding:6px;margin:0;background:rgba(0,0,0,0.05);border-radius:6px;'>";
			$out .= trim($block);
			$out .= "</span>";
		}
		// Even: Parse normally //
		else {
			$subblocks = explode('`',$block);
			foreach($subblocks as $subkey => $subblock) {
				// Odd: Wrap in a code tag //
				if ( $subkey & 1 ) {
					$out .= "<span class='code' style='font-family:monospace;border:1px solid rgba(0,0,0,0.2);padding:3px;margin:0 2px;background:rgba(0,0,0,0.05);border-radius:6px;'>";
					$out .= trim($subblock);
					$out .= "</span>";
				}
				else {
					$out .= nl2br($subblock);
				}
			}
		}
	}
	
	return $out;
}

?>
