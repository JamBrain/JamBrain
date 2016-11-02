<?php
/** @file style.php 
*	@brief a General Include for generating Style sheets 
*
*	**NOTE**: Unlike api.php and web.php, files that include style.php are meant to be standalone.
**/

// Benchmarking //
$_CORE_SCRIPT_TIMER = microtime(true);

// Emit the CSS content type //
header("Content-Type: text/css; charset: UTF-8");

// Includes //
require_once __DIR__."/core/internal/css.php";
require_once __DIR__."/core/internal/core.php";
?>
