<?php
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/../core/internal/urlhash.php";


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
echo "Rando: " . $rando . "     (" . urlhash_encode($rando) . ") => (" . urlhash_decode(urlhash_encode($rando)) .")<br />\n";

echo "<br />\n";
echo "<br />\n";

echo '$_GET:<br /><pre>';
print_r( $_GET );
echo '</pre>';

echo "<br />\n";
echo "<br />\n";

echo '$_SERVER:<br /><pre>';
print_r( $_SERVER );
echo '</pre>';

// If ID is bad //

?>
