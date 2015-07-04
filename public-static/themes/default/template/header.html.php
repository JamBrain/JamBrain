<?php header("Content-Type: text/html; charset=utf-8"); ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">	
<?php if ( defined('CMW_JS_DEBUG') ) { ?>

	<!-- External JavaScript -->
	<script src="<?php STATIC_URL() ?>/external/emojione/emojione.js<?php VERSION_QUERY() ?>"></script>
	<!--<script src="//cdn.jsdelivr.net/emojione/1.3.0/lib/js/emojione.min.js"></script>--><!-- min only -->
	
	<!-- Internal JavaScript -->
	<script src="<?php STATIC_URL() ?>/internal/src/love.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/src/star.js<?php VERSION_QUERY() ?>"></script>

<?php } else { /* defined('CMW_JS_DEBUG') */ ?>
	<script src="<?php STATIC_URL() ?>/external/emojione/emojione.min.js<?php VERSION_QUERY() ?>"></script>
	<!--<script src="//cdn.jsdelivr.net/emojione/1.3.0/lib/js/emojione.min.js"></script>-->	
	<script src="<?php STATIC_URL() ?>/internal/core.min.js<?php VERSION_QUERY() ?>"></script>
<?php } /* defined('CMW_JS_DEBUG') */ ?>
<?php if ( defined('CMW_CSS_DEBUG') ) { ?>
	<!-- External CSS -->
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/external/emojione/emojione.css<?php VERSION_QUERY() ?>" />
	<!--<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/1.3.0/assets/css/emojione.min.css" />-->
<?php } else { /* defined('CMW_CSS_DEBUG') */ ?>
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/external/emojione/emojione.min.css<?php VERSION_QUERY() ?>" />
	<!--<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/1.3.0/assets/css/emojione.min.css" />-->
<?php } /* defined('CMW_CSS_DEBUG') */ ?>
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/themes/default/style.css.php<?php VERSION_QUERY() ?>" />
</head>