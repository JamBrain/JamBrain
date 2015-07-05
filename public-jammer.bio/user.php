<?php
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/util.php";

// Retrieve Action and Arguments
$arg = util_ParseActionURL();
$user = array_shift($arg);
$arg_count = count($arg);

db_Connect();

//jammer.bio stub

//<strong>jammer<strong>, powered by <a href="http://ludumdare.com">Ludum Dare</a>

?>
<?php template_GetHeader(); ?>
<body>
	
<?php
	if ( $arg_count > 0 ) {
		echo $arg[0] . " by " . $user;
	}
	else {
		echo $user . "'s home page";
	}
?>

<br />
<br />
<div style="text-align:center;background:#000;color:#FFF;padding:8px;font-variant:small-caps"><img src="<?php STATIC_URL(); ?>/logo/jammer/JammerLogo28W.png" height="28" alt="Jammer" title="Jammer" style="vertical-align:middle;" /> by <a href="http://twitter.com/mikekasprzak" target="_blank"><img src="http://www.gravatar.com/avatar/8266e6e52fe185d057db55021ac7bb86?s=16" width="16" height="16" style="vertical-align:middle;"></a> | powered by <a href="http://ludumdare.com" target="_blank"><img src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo20W.png" height="20" alt="Ludum Dare" title="Ludum Dare" style="vertical-align:middle;" /></a></div>

</body>
<?php template_GetFooter(); ?>
