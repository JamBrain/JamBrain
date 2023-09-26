<?php
require_once __DIR__ . "/../web.php";

// HTML Library Configuration //
const HTML_USE_CORE = true;
const HTML_USE_STARSHIP = true;
const HTML_SHOW_FOOTER = true;

?>
<?php template_GetHeader(); ?>
hey <br />
<br />
<span onClick="if ( cache_Store('moofer',10,5000) ) console.log(this.innerHTML);">[Store 10]</span>
<span onClick="if ( cache_Store('moofer',20,5000) ) console.log(this.innerHTML);">[Store 20]</span>
<span onClick="if ( cache_Create('moofer',30,5000) ) console.log(this.innerHTML);">[Create 30]</span>
<span onClick="console.log(this.innerHTML,cache_Fetch('moofer'));">[Read]</span>
<span onClick="console.log(this.innerHTML,cache_Exists('moofer'));">[Exists]</span>
<span onClick="if ( cache_Touch('moofer',5000) ) console.log(this.innerHTML);">[Touch]</span>
<span onClick="cache_Flush(); console.log(this.innerHTML);">[Flush]</span>

<span onClick="if ( cache_Store('ooferdoo',33,7000) ) console.log(this.innerHTML);">[Other Store 33]</span>
<br />
<br />
<?php template_GetFooter(); ?>
