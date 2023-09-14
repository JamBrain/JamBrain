<?php

$IE_VER_START = strpos($_SERVER['HTTP_USER_AGENT'],'MSIE') + 5;
$IE_VER_END = strpos($_SERVER['HTTP_USER_AGENT'],';',$IE_VER_START);

$BROWSER_VENDOR = "Microsoft";
$BROWSER_NAME = $BROWSER_VENDOR." Internet Explorer";
$BROWSER_VER = floatval(substr($_SERVER['HTTP_USER_AGENT'],$IE_VER_START,$IE_VER_END));
$BROWSER_STRING = $BROWSER_NAME.' '.$BROWSER_VER;

?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<style>
		body {
			font-family: Sans-Serif;
		}
	</style>
</head>
<body>
	<h1>Obsolete Web Browser Detected</h1>
	<p>
		We're sorry, but your web browser (<?=$BROWSER_STRING?>) is not supported.
	<p>
	<p>
		This browser is <strong>very</strong> insecure, no longer supported by <?=$BROWSER_VENDOR?>, and generally <strong>extremely</strong> unsafe to use.
		Not to mention, we're doing some <strong>really cool stuff</strong> on this website, stuff that needs <em>at-least</em> a web browser from 2013. Things on the internet move extremely quickly. Don't be left behind!
	</p>
	<p>
		We recommend the <strong><a href="https://www.google.com/chrome/">Google Chrome</a></strong> web browser, by far the most secure of the web browsers. It features <a href="https://www.youtube.com/watch?v=29e0CtgXZSI">sandboxing</a>, a strong security feature that helps mitigate exploits.
	</p>
	<p>
		Alternatively, <strong><a href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a></strong> is a very good web browser. Both the Chrome and Firefox teams are pushing the envelope of next generation browser features, so either broswer is a good choice.
	</p>
	<p>
		Need another choice? Check out the <strong><a href="http://www.opera.com/">Opera</a></strong> web browser.
	</p>
	<p>
		Finally, if you are on <strong>Windows 10</strong> or better, you should be running <strong><a href="https://www.microsoft.com/en-ca/windows/microsoft-edge">Microsoft Edge</a></strong> instead of this web browser. If you're on Windows 7, 8, or 8.1, you can upgrade to <strong><a href="https://www.microsoft.com/en-ca/download/internet-explorer-11-for-windows-7-details.aspx">Internet Explorer 11</a></strong>, but we would still recommend one of the above choices.
	</p>
	<p>
		If you are not on a computer (i.e. Xbox, Windows Phone, etc), we'd encourage you to switch to your computer, or to a smartphone purchased in the last couple years.
	</p>
	<p>
		For more choices, visit <a href="https://whatbrowser.org/">whatbrowser.org</a>
	</p>
</body>
</html>