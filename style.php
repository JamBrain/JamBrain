<?php
/** style.php - a General Library Include for generating stylesheets 

	**NOTE**: Unlike api.php and web.php, files that include style.php are meant to be standalone.
**/

// Emit the CSS content type //
header("Content-Type: text/css; charset: UTF-8");

// Includes //
require_once __DIR__."/core/internal/css.php";
?>
