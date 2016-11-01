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

const MOBILE_AND_TABLET_QUERY = "(max-width : 800px)";
const TABLET_AND_NORMAL_QUERY = "(min-width : 601px) AND (max-width : 1600px)";
const TABLET_PLUS_QUERY = "(min-width : 601px)";
const NORMAL_PLUS_QUERY = "(min-width : 801px)";

const NOT_MOBILE_QUERY = "(min-width : 601px)";
const NOT_TABLET_QUERY = "(max-width : 600px) OR (min-width : 801px)";
const NOT_NORMAL_QUERY = "(max-width : 800px) OR (min-width : 1600px)";
const NOT_HIGHRES_QUERY = "(max-width : 1600px)";
// TODO: Figure out if we even need the 1 in 601 and 801 //

?>
