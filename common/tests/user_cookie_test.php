<?php

require_once __DIR__ . "/../../core/user.php";

echo "UserID: ".$USER_ID;
echo "<br>";
echo "HasCookie: ".(user_HasCookie() ? "true" : "false");