<?php
// TODO: Figure out if this is the live server or not //
define('USE_MINIFIED',isset($_GET['debug']) ? '' : '.min');
define('USE_VERSION','0.1');
?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="//static.jammer.work/output/all<?=USE_MINIFIED?>.css?v=<?=USE_VERSION?>">
</head>

<body>
	<script src="//static.jammer.work/output/all<?=USE_MINIFIED?>.js?v=<?=USE_VERSION?>"></script>
	Hello
</body>
</html>
