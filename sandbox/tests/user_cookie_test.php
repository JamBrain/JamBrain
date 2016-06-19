<?php

require_once __DIR__ . "/../../core/user.php";

// Do Actions //
if ( isset($_POST['action']) ) {
	switch ($_POST['action']) {
		case "delete":
			setcookie("SID","",time()-60*60/*expire*/,"/"/*path*/,""/*domain*/,false/*https*/,true/*httponly*/);
			break;
		case "set":
			setcookie("SID","Hello Wurld",time()+60*60/*expire*/,"/"/*path*/,""/*domain*/,false/*https*/,true/*httponly*/);
			break;
	};
}
// Refresh Page (if needed) //
if ( isset($_GET['refresh']) ) {
	header("Refresh:0; url=?");
	exit;
}


// Show status //
echo "UserID: ".$USER_ID;
echo "<br>";
echo "HasCookie: ".(user_HasCookie() ? "true" : "false");

?>

<form action="?refresh" method="post">
	<input type="hidden" name="action" value="set" />
	<button type="submit">Set</button>
</form>
<form action="?refresh" method="post">
	<input type="hidden" name="action" value="delete" />
	<button type="submit">Delete</button>
</form>
