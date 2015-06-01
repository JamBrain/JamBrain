<?php 
header("Content-Type: text/html; charset=utf-8"); 
?>

<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
</head>

<body>

<?php
require_once __DIR__ . "/../db.php";
require_once __DIR__ . "/../lib.php";
require_once __DIR__ . "/../lib/validate.php";

?>
So. It has come to this...<br />
<br />
<?php

$berg = apcu_fetch( "Hamburg" );

if ( $berg === false ) {
	$berg = 1;
}
else {
	$berg++;
}

apcu_store( "Hamburg", $berg );

echo "Mr Berg: " . $berg . "<br />";

user_start();

if ( user_getId() === 0 ) {
	user_setId( 200 );
}
else {
	user_setId( user_getId()+1 );
}

?>

<a href="javascript:alert('mommy');">hey</a>

<a href="mailto:mikekasprzak(is_a_jerk)@gmail.com">hahaha</a>
<a href="mailto:webmaster@198.84.214.150">hahaha</a>

<?php

print_r( parse_url("javascript:alert('mommy');") );

print_r( parse_url("HTTp://bogart.com/meat/lefties/?snoop=11") );

print_r( parse_url("magnet:?xt=urn:sha1:YNCKHTQCWBTRNJIV4WNAE52SJUQCZO5C") );

echo '<br />';
echo '<br />';

echo 'Wörmann';
echo htmlspecialchars('Wörmann', ENT_COMPAT|ENT_SUBSTITUTE, 'UTF-8');

echo '<br />';
echo '<br />';

const happypoo = '💩';


echo happypoo . happypoo;

echo '<br />';
echo '<br />';

$str = "Glorious is this world. \"It belongs to ME!\". She thought 'why'. <strong>man</strong> \xE3\x82\xA2 \xC3\xA0 \xF0\x9F\x92\xA9";
$str .= "\xEF\xBF\xBE"; // Bad Code U+FFFE

echo "<a href='" . $str . "'>" . $str . "</a>";

echo '<br />';
echo '<br />';

$str2 = htmlspecialchars($str,ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_url($str2);

echo '<br />';
echo '<br />';


$str2 = htmlspecialchars("http://ludumdare.com/EAT MY PHAT D[LK",ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_url($str2);

echo '<br />';
echo '<br />';


$str2 = htmlspecialchars("gozer://google.com/shempy",ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_url($str2);

?>

</body>
</html>