<?php

require_once __DIR__."/../core/internal/core.php";
require_once __DIR__."/../core/internal/cache.php";

$action = core_ParseActionURL();

$protocol = $_SERVER['REQUEST_SCHEME'];
$host = "//" . $_SERVER['HTTP_HOST'];
$self = substr($_SERVER['SCRIPT_NAME'],strrpos($_SERVER['SCRIPT_NAME'],'/')+1);
$base = substr($_SERVER['SCRIPT_NAME'],0,strrpos($_SERVER['SCRIPT_NAME'],'/'));
$image = "/" . implode('/',$action);

echo $protocol,' | ',$host,' | ',$self,' | ',$base,' | ',$image;

echo "<br>\n<br>\n";

print_r($_SERVER);