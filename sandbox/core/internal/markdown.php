<?php
// This markdown library is based on HTML-To-Markdown, but is heavily modified and rewritten.
// https://github.com/nickcernis/html-to-markdown

// The original was designed to be fed pure HTML, where I needed a version that supported
// a hybrid of HTML and existing Markdown. I also prefer the GitHub syntax, so 

function markdown_ConvertCode($node) {
	$output = '';

	// Store the content of the code block in an array, one entry for each line
	$code_content = html_entity_decode($node->C14N());
	$code_content = str_replace(["<code>", "</code>"], "", $code_content);
	$code_content = str_replace(["<pre>", "</pre>"], "", $code_content);

	$lines = preg_split('/\v/Su', $code_content);
	$total = count($lines);

	// If there's more than one line of code, prepend each line with four spaces and no backticks.
	if ($total > 1 || $node->nodeName === 'pre') {

		// Remove the first and last line if they're empty
		$first_line = trim($lines[0]);
		$last_line = trim($lines[$total - 1]);
		$first_line = trim($first_line, "&#xD;"); //trim XML style carriage returns too
		$last_line = trim($last_line, "&#xD;");

		if (empty($first_line))
			array_shift($lines);

		if (empty($last_line))
			array_pop($lines);

		$output .= '```' . PHP_EOL;
		foreach ($lines as $line) {
			$line = str_replace('&#xD;', '', $line);
			$output .= $line . PHP_EOL;
		}
		$output .= '```' . PHP_EOL;
	}
	// There's only one line of code. It's a code span, not a block. Just wrap it with backticks.
	else {
		$output .= "`" . $lines[0] . "`";
	}
	
	return htmlspecialchars($output);
}


function markdown_Prefix($node) {
	$tag = &$node->nodeName;
	$value = &$node->nodeValue;

	switch ($tag) {
		case "h1":
			return "# ";
		case "h2":
			return "## ";
		case "h3":
			return "### ";
		case "h4":
			return "#### ";
		case "h5":
			return "##### ";
		case "h6":
			return "###### ";

		case "b":
		case "strong":
			return "**";

		case "i":
		case "em":
			return "*";

		case "del":
			return "~~";

		case "p":
			return PHP_EOL;
			
		case "code":
		case "pre":
			return markdown_ConvertCode($node);
		
		case "img":
			return "IMG";
		case "a":
			return "IMG";

		case "br":
			return PHP_EOL;
		
		case "#text":
			return $value;
	}
	
	return "";
}


function markdown_Suffix($node) {
	$tag = &$node->nodeName;
	$value = &$node->nodeValue;

	switch ($tag) {
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
			return PHP_EOL;

		case "b":
		case "strong":
			return "**";

		case "i":
		case "em":
			return "*";

		case "del":
			return "~~";

		case "p":
			return PHP_EOL;
	}
	
	return "";
}



function markdown_ConvertChildren($node,&$output,$level=0) {
	$output .= markdown_Prefix($node);
	
	$tag = &$node->nodeName;
	if ( $tag == "code" || $tag == "pre" )
		return $output;

	// If the node has children, convert those to Markdown first
	if ($node->hasChildNodes()) {
		$length = $node->childNodes->length;
		
		for ($i = 0; $i < $length; $i++) {
			$child = $node->childNodes->item($i);

			markdown_ConvertChildren($child,$output,$level+1);
		}
	}

	$output .= markdown_Suffix($node);
}


function markdown_EmitBlocks($text,$symbol='`',$block_start="<code>",$block_end="</code>") {
	$output = "";
	
	$data = explode($symbol,$text);
	$previous = null;
	// Step 1. Collapse all empty fields in to a numeric value.
	foreach ( $data as $key => &$value ) {
		if ( empty($value) ) {
			if ( is_numeric($previous) ) {
				unset($data[$key]);
				$previous++;
			}
			else {
				$value = 1;
				$previous = &$value;
			}
		}
		else {
			$previous = null;
		}
		
		$previous = &$value;
	}
	
	// So long as the first element isn't a number, output it.
	if ( !is_numeric($value) ) {
		$output .= array_shift($data);
	}

	$open = false;
	$level = -1;
	foreach ( $data as &$value ) {
		if ( $open ) {
			$vslevel = is_numeric($value) ? $value+1 : 1;
			
			if ( $level == $vslevel ) {
				$open = false;
				$level = -1;
				$output .= $value . $block_end;
			}
			else {
				//if ( $vslevel > 1 ) {
					$output .= $value;
					$open = false;
				//}
			}
		}
		else {
			$level = is_numeric($value) ? $value+1 : -1;
			if ( $level > 0 ) {
				$open = true;
				$output .= $block_start;
			}
		}
	}
	
	//print_r( $data );
	
	return $output;
}

function markdown_FromHTML($text) {	
	// Step 1: Convert backticks to <code> blocks (so to safely preserve them).
	$text = markdown_EmitBlocks($text);
	
	echo htmlspecialchars($text);
	
	// Step 2: Parse the input as a DOM.
	$doc = new DOMDocument();
	
	libxml_use_internal_errors(true);
	
	$doc->loadHTML('<?xml encoding="UTF-8">' . $text);
	$doc->encoding = 'UTF-8';
	
	libxml_clear_errors();
	
	$input = $doc->getElementsByTagName("html")->item(0);
	
	// Step 3: Generate output.
	$output = "";
	if ( !empty($input) ) {
		markdown_ConvertChildren($input,$output);
	}
	
	// Step 4: Remove redundant newlines (max 2 per)
//	$output = preg_replace('/\v{2,}/Su', "\n\n", $output);
	
	// Remove whitespace from start and end //
	$output = trim($output);

	// Finished.
	return $output;
}

?>
