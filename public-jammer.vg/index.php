<?php
// TODO: Figure out if this is the live server or not //
define('USE_MINIFIED',isset($_GET['debug']) ? '' : '.min');
define('USE_VERSION','0.1');
const STATIC_DOMAINS = [ 
	'jammer.work'=>'static.jammer.work',
	'jammer.dev'=>'static.jam.dev',
	'jammer.vg'=>'static.jam.vg'
];
define('STATIC_DOMAIN', STATIC_DOMAINS[$_SERVER['SERVER_NAME']]);
?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Lato:300,300italic,700,700italic|Crimson+Text:400italic" type="text/css">
	<link rel="stylesheet" href="//<?=STATIC_DOMAIN?>/output/all<?=USE_MINIFIED?>.css?v=<?=USE_VERSION?>" type="text/css">
</head>

<body>
	<script src="//<?=STATIC_DOMAIN?>/output/all<?=USE_MINIFIED?>.js?v=<?=USE_VERSION?>"></script>
	<div id="layout">
		<div id="content">
			<p class="_unmargin-top">Hello. <strong>Something</strong> is going to happen.</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum risus in lectus rutrum, sed dictum nisi rhoncus. Duis a tortor dictum, imperdiet erat vitae, bibendum ante. Praesent a neque luctus, vehicula magna at, suscipit eros. Ut vitae odio ex. Morbi fermentum diam at purus venenatis posuere. Aenean faucibus mollis nisl, eget faucibus lacus venenatis eu. Etiam a dui vel nisi cursus dictum. Mauris nec vestibulum turpis, sed faucibus libero. Quisque eget nulla quis velit molestie semper. Integer non ipsum nisi. Vivamus eget libero eu sapien sollicitudin cursus.</p>
			<p>Sed mattis lectus sed lobortis eleifend. Donec nec posuere lorem, sed feugiat quam. Nulla vitae odio at justo vehicula vehicula vitae sed magna. Aenean risus nisi, gravida non placerat quis, tincidunt a mauris. Nulla sagittis aliquet felis non posuere. Curabitur dapibus felis vel sem facilisis, at pretium justo sodales. Nunc malesuada, elit vel iaculis dignissim, urna dolor feugiat purus, tincidunt euismod sapien sapien ac magna. Pellentesque vel gravida ex.</p>
			<p>Nullam at sagittis metus, et fermentum mi. Vestibulum ornare a dui sed cursus. Nulla facilisi. Nunc viverra nisl eleifend mi lacinia, tristique fringilla ipsum tincidunt. Pellentesque porttitor metus dolor, eu sodales nibh venenatis eget. Nunc luctus enim neque, nec dignissim orci dictum et. Quisque sagittis vitae eros faucibus hendrerit. Donec suscipit augue neque, in pulvinar enim sodales at. In sagittis lacus at erat gravida elementum. Ut semper dui id nisi finibus, non accumsan libero consectetur. In nunc turpis, blandit sed ex in, cursus ultricies urna. Etiam ultricies auctor felis, ac iaculis ligula accumsan ornare. Fusce vehicula quam mi, in malesuada velit cursus quis. Nunc ac dolor ut purus pulvinar maximus. Aliquam quis mi auctor, maximus turpis eget, faucibus neque. Proin ut odio vel metus hendrerit laoreet.</p>
			<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed interdum venenatis nunc, mattis interdum turpis tincidunt eget. Suspendisse turpis dolor, lacinia et leo id, feugiat fermentum ligula. Aenean at nulla eget ipsum commodo consequat vel et est. Proin laoreet mollis aliquam. Nullam in pulvinar nunc. Donec tempor dapibus odio, sollicitudin ultrices nisi fermentum eu. Proin semper turpis vel pharetra convallis. Nulla vestibulum mi libero, a tristique lorem ullamcorper consectetur. Nullam non dolor rhoncus lectus lacinia ultricies. Sed egestas libero quis tincidunt eleifend. Nullam a metus ac elit iaculis ullamcorper sed id nisl. Vestibulum facilisis non diam ut commodo. Sed eget eleifend elit.</p>
			<p class="_unmargin-bottom">Pellentesque et arcu tempor, sagittis ipsum in, iaculis velit. Etiam laoreet erat luctus, suscipit mauris eu, egestas nulla. In vulputate tempor vulputate. Pellentesque dignissim, urna non iaculis consequat, nisi magna tincidunt eros, et interdum ligula dui eget est. Praesent a lacus quis odio consequat suscipit. Vivamus vitae ligula et velit laoreet euismod id non nulla. Etiam sollicitudin dui at nibh tristique ullamcorper. Mauris est nibh, semper vitae est eu, elementum tincidunt elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque tempus ut nunc sit amet hendrerit. Nunc nec mattis diam, at rutrum eros. Donec finibus nisi vel nisi molestie, eu ornare justo rhoncus. Nam rutrum lacus quis est malesuada, sit amet pretium erat euismod. Nunc efficitur convallis leo id efficitur. Suspendisse potenti. Pellentesque euismod nulla vel purus interdum vestibulum.</p>
		</div>
		<div id="sidebar">
			<p class="_unmargin-top">Sidebar</p>
			<p class="_unmargin-bottom">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc bibendum risus in lectus rutrum, sed dictum nisi rhoncus. Duis a tortor dictum, imperdiet erat vitae, bibendum ante. Praesent a neque luctus, vehicula magna at, suscipit eros. Ut vitae odio ex. Morbi fermentum diam at purus venenatis posuere. Aenean faucibus mollis nisl, eget faucibus lacus venenatis eu. Etiam a dui vel nisi cursus dictum. Mauris nec vestibulum turpis, sed faucibus libero. Quisque eget nulla quis velit molestie semper. Integer non ipsum nisi. Vivamus eget libero eu sapien sollicitudin cursus.</p>
		</div>
	</div>
	<div id="footer">Footer</div>
</body>
</html>
