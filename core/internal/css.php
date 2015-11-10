<?php
/** @file css.php
*	@brief Support library for emitting CSS (typically for generating Style sheets)
**/

include_once __DIR__ . "/../../config.php";

// CSS Media Queries //
const MOBILE_QUERY = "(max-width : 600px)";
const TABLET_QUERY = "(min-width : 601px) AND (max-width : 800px)";
const NORMAL_QUERY = "(min-width : 801px) AND (max-width : 1600px)";
const HIGHRES_QUERY = "(min-width : 1600px)";
// TODO: Figure out if we even need the 1 in 601 and 801 //

const MOBILE_AND_TABLET_QUERY = "(max-width : 800px)";

?>
