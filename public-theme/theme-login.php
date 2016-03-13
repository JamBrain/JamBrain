<?php

function ShowLogin() {
	$LOGIN_URL = LEGACY_LOGIN_URL;
	if ( isset($GLOBALS['DO_BETA']) ) {
		if ( strpos($LOGIN_URL,"?") === false )
			$LOGIN_URL .= "?beta";
		else
			$LOGIN_URL .= "&beta";
	}
?>
	<div class="login" id="action-login">
		<div>You need to login to vote.</div>
		<br />
		<a class="no-style" href="<?=$LOGIN_URL?>"><button type="button" class="login-button green_button">Login</button></a>
	</div>	
<?php
}
function ShowLogout() {
?>
	<div class="login" id="action-logout">
		<button type="button" class="login-button" onclick="legacy_DoLogout(true)">Logout</button>
	</div>	
<?php
}
