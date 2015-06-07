<?php 
require_once __DIR__ . "/../html.php";
require_once __DIR__ . "/../core/lib/validate.php";
require_once __DIR__ . "/../core/lib/emoji.php";
require_once __DIR__ . "/../core/post.php";

user_StartSession();
header("Content-Type: text/html; charset=utf-8"); 
?>

<!doctype html>

<html lang="en">
<head>
	<meta charset="utf-8">
	<script src="<?php STATIC_URL() ?>/lib/emojione/emojione.js<?php VERSION_QUERY() ?>"></script>
<!--	<script src="//cdn.jsdelivr.net/emojione/1.3.0/lib/js/emojione.min.js"></script>-->
	<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/1.3.0/assets/css/emojione.min.css" />
</head>

<body>

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


echo emoji_ToShort(happypoo . happypoo . ":D You smell ") . happypoo;

echo "<script>emojione.ascii = true;</script>";
echo "<script>
var MyAscii = {
	'^_^':'1F49A',
	'KeyWord':'1f636'
};

for(var Key in MyAscii) {
	emojione.asciiList[Key] = MyAscii[Key];
}

var MyCode = {
	':dpad:':['custom/dpad'],
};

for(var Key in MyCode) {
	emojione.emojioneList[Key] = MyCode[Key];
}
</script>";

echo "<div id='zork'></div>";
echo "<script>document.getElementById('zork').innerHTML = emojione.toImage(emojione.toShort(
	'can you believe that there is 💩  everywhere! :D :| ^_^ :> :( KeyWord :dpad:'));</script>";

echo '<br />';
echo '<br />';

$str = "Glorious is this world. \"It belongs to ME!\". She thought 'why'. <strong>man</strong> \xE3\x82\xA2 \xC3\xA0 \xF0\x9F\x92\xA9";
$str .= "\xEF\xBF\xBE"; // Bad Code U+FFFE

echo "<a href='" . $str . "'>" . $str . "</a>";

echo '<br />';
echo '<br />';

$str2 = htmlspecialchars($str,ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_Url($str2);

echo '<br />';
echo '<br />';


$str2 = htmlspecialchars("http://ludumdare.com/EAT ME ]ZHVWOOOT[",ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_Url($str2);

echo '<br />';
echo '<br />';


$str2 = htmlspecialchars("gozer://google.com/shempy",ENT_QUOTES);

echo "<a href='" . $str2 . "'>" . $str2 . "</a> : " . sanitize_Url($str2);

echo "<br>\n";
echo "<br>\n";

echo "<div>";
echo post_Prepare("


<h1>My Greatness!</h1>
Let me tell you about how <strong>GREAT</strong> I am. It began in the <del>1960's</del> 1970's.<br>
<br/>
<br/>
<p>Well, really that was it. <img src='tom.png'></p>
noobs.
get a job
  now!

```c++
source code
  saucy!!
```

<code>This HTML is da <b>REAL DEAL</b></code>

<code>
int main(void) {
	return 10;
}
</code>

* Lets eat
  * I eat more
  * he does
* Oh my!


");

echo "</div>\n";

?>

<div class="miiverse-post" lang="en" data-miiverse-cite="https://miiverse.nintendo.net/posts/AYMHAAACAAADVHkJJYjfzQ" data-miiverse-embedded-version="1"><noscript>You must have JavaScript enabled on your device to view Miiverse posts that have been embedded in a website. <a class="miiverse-post-link" href="https://miiverse.nintendo.net/posts/AYMHAAACAAADVHkI56BLCQ">View post in Miiverse.</a></noscript></div><script async src="https://miiverse.nintendo.net/js/embedded.min.js" charset="utf-8"></script>

</body>
</html>