<!DOCTYPE html>
<html>
<head>
	<title>Emergency Mike Chat</title>
	<style>
		body, html {
			margin:0;
			width:100%;
			height:100%;
			position:relative;
		}
		#framer {
			position:fixed; 
			top:0px; left:0px; bottom:0px; right:0px; 
			width:100%; height:100%; 
			border:none; 
			margin:0; padding:0; 
			overflow:hidden; z-index:999999;			
		}
		#eframer {
			position: absolute;
			top: 0px;
			bottom: 0px;
			width:100%;
		}
	</style>
</head>
<body>
	<iframe id="framer" src="https://kiwiirc.afternet.org/#mike"></iframe>
</body>
</html>

<?php
/*
require_once __DIR__."/../db.php";
require_once __DIR__."/../core/internal/core.php";


// Parse the URL //


// Validate/Convert to an ID //


// Check if cached (APCu), and emit stored redirect URL if it is (END) //


// Do database lookup for Item ID, cache (APCu) and emit redirect URL (END) //

//apcu_store(); // Cache value for 5 minutes //


// If no ID is present //
echo "<strong>ldj.am</strong> - Ludum Dare URL shortener.";

echo "<br />\n";
echo "<br />\n";

echo "Int: " . PHP_INT_MAX;

echo "<br />\n";
echo "<br />\n";

$rando = mt_rand();
echo "Rando: " . $rando . "     (" . base48_Encode($rando) . ") => (" . base48_Decode(base48_Encode($rando)) .")<br />\n";

echo "<br />\n";
echo "<br />\n";
/*
echo '$_GET:<br /><pre>';
print_r( $_GET );
echo '</pre>';

echo "<br />\n";
echo "<br />\n";

echo '$_SERVER:<br /><pre>';
print_r( $_SERVER );
echo '</pre>';
*/
// If ID is bad //


