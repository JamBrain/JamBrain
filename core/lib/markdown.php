<?php
require_once __DIR__ . "/external/html-to-markdown/HTML_To_Markdown.php";

// the Markdown library uses HTML-To-Markdown: https://github.com/nickcernis/html-to-markdown

function toMarkdown($node) {
    $tag = &$node->nodeName;
    $value = &$node->nodeValue;

	switch ($tag) {
		case "h1":
			return "# " . $value . PHP_EOL;
		case "h2":
			return "## " . $value . PHP_EOL;
		case "h3":
			return "### " . $value . PHP_EOL;
		case "h4":
			return "#### " . $value . PHP_EOL;
		case "h5":
			return "##### " . $value . PHP_EOL;
		case "h6":
			return "###### " . $value . PHP_EOL;

		case "b":
		case "strong":
			return "**" . $value . "**";

		case "i":
		case "em":
			return "*" . $value . "*";

		case "del":
			return "~~" . $value . "~~";

		case "p":
			return "\n" . $value . "\n";
		
		case "img":
			return "IMG";

		case "br":
			return "\n";
			
		case "body":
		case "html":
			return "";
		default: {
			return $value;
		}
	}
	
	return "";
}


function is_child_of($parent_name, $node){
    for ($p = $node->parentNode; $p != false; $p = $p->parentNode) {
        if (is_null($p))
            return false;

        if ( is_array($parent_name) && in_array($p->nodeName, $parent_name) )
            return true;
        
        if ($p->nodeName == $parent_name)
            return true;
    }
    return false;
}

function markdown_ConvertCode($node) {
    // Store the content of the code block in an array, one entry for each line

    $markdown = '';

    $code_content = html_entity_decode($node->C14N());
    $code_content = str_replace(array("<code>", "</code>"), "", $code_content);
    $code_content = str_replace(array("<pre>", "</pre>"), "", $code_content);

    $lines = preg_split('/\r\n|\r|\n/', $code_content);
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

        $count = 1;
        foreach ($lines as $line) {
            $line = str_replace('&#xD;', '', $line);
            $markdown .= "    " . $line;
            // Add newlines, except final line of the code
            if ($count != $total)
                $markdown .= PHP_EOL;
            $count++;
        }
        $markdown .= PHP_EOL;

    } else { // There's only one line of code. It's a code span, not a block. Just wrap it with backticks.

        $markdown .= "`" . $lines[0] . "`";

    }
    
    return $markdown;
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
			return "\n";
			
		case "code":
			return htmlspecialchars(markdown_ConvertCode($node));//htmlspecialchars($node->C14N());
		
		case "img":
			return "IMG";

		case "br":
			return "\n";
		
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
			return "\n";
	}
	
	return "";
}



function convert_children($node,&$output,$level=0) {
//   	// Don't convert HTML code inside <code> and <pre> blocks to Markdown - that should stay as HTML
//    if (self::is_child_of(array('pre', 'code'), $node))
//        return;

    if ( is_child_of(['pre', 'code'], $node) ) {
        return "";//"WHAAAAAAAAAAAAAAAAT";//$node->nodeValue;
    }

	$output .= markdown_Prefix($node);

    // If the node has children, convert those to Markdown first
    if ($node->hasChildNodes()) {
        $length = $node->childNodes->length;
        
        for ($i = 0; $i < $length; $i++) {
            $child = $node->childNodes->item($i);
 
//			if ( $length === 1 ) {
//				if ( $child->nodeName === "#text" )
//					break;
//			}

            convert_children($child,$output,$level+1);
        }
    }

	$output .= markdown_Suffix($node);
    
    //$tag = $node->nodeName;
    //$value = $node->nodeValue;
    
    //echo $tag . ": \"" . $value . "\"\n";
    
    //$output .= "***" . $node->nodeName . "[".$level."]***:" . toMarkdown($node);
//	$output .= toMarkdown($node);

//    // Now that child nodes have been converted, convert the original node
//    $markdown = $this->convert_to_markdown($node);
//
//    // Create a DOM text node containing the Markdown equivalent of the original node
//    $markdown_node = $this->document->createTextNode($markdown);
//
//    // Replace the old $node e.g. "<h3>Title</h3>" with the new $markdown_node e.g. "### Title"
//    $node->parentNode->replaceChild($markdown_node, $node);

}

function markdown_FromHTML($text) {
	// Convert newlines to '<br />' tags, to preserve line spacing
	//$text = nl2br($text,true);
	
	$doc = new DOMDocument();
	
	libxml_use_internal_errors(true);
	
	$doc->loadHTML('<?xml encoding="UTF-8">' . $text);
	$doc->encoding = 'UTF-8';
	
	libxml_clear_errors();
	
	$input = $doc->getElementsByTagName("html")->item(0);
	
	$output = "";
	convert_children($input,$output);
	
	//echo $output;
	
	//print_r($input);
	
/*	
	// 'header_style'=>'atx' means use "# Headers" instead of Underlined with ====== headers.
	$text = new HTML_To_Markdown($text, ['strip_tags'=>true,'header_style'=>'atx']);

	// Replace trailing spaces from lines.
//	$text = preg_replace('/\h+\v/Su', "\n", $text);
	$text = preg_replace('/\h+$/Sum', "", $text);

//	// Replace single prefix spaces from lines.
//	$text = preg_replace('/\v\h/Su', "\n", $text);
*/

	// Remove redundant newlines (max 2 per)
//	$output = preg_replace('/\v{2,}/Su', "\n\n", $output);

/*	
	// Remove whitespace from start and end //
	$text = trim($text);
*/	
	return $output;
}

?>
