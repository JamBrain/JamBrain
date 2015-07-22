<?php header("Content-Type: text/html; charset=utf-8"); ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">	
<?php if ( defined('CMW_JS_DEBUG') ) { ?>

	<!-- External JavaScript -->
	<script src="<?php STATIC_URL() ?>/custom/emojitwo/emojitwo.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/external/prism/prism.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/external/marked/marked.js<?php VERSION_QUERY() ?>"></script>
	
	<!-- Internal JavaScript -->
	<script src="<?php STATIC_URL() ?>/internal/src/xhr.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/src/cache.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/src/html.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/src/love.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/src/star.js<?php VERSION_QUERY() ?>"></script>

<?php } else { /* defined('CMW_JS_DEBUG') */ ?>
	<script src="<?php STATIC_URL() ?>/custom/emojitwo/emojitwo.min.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/external/prism/prism.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/external/marked/marked.min.js<?php VERSION_QUERY() ?>"></script>
	<script src="<?php STATIC_URL() ?>/internal/core.min.js<?php VERSION_QUERY() ?>"></script>
<?php } /* defined('CMW_JS_DEBUG') */ ?>

	<!-- External CSS -->
<?php if ( defined('CMW_CSS_DEBUG') ) { ?>
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/custom/emojitwo/emojitwo.css<?php VERSION_QUERY() ?>" />
<?php } else { /* defined('CMW_CSS_DEBUG') */ ?>
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/custom/emojitwo/emojitwo.min.css<?php VERSION_QUERY() ?>" />
<?php } /* defined('CMW_CSS_DEBUG') */ ?>
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/external/prism/prism.css<?php VERSION_QUERY() ?>" />
	<link rel="stylesheet" href="<?php STATIC_URL() ?>/themes/default/style.css.php<?php VERSION_QUERY() ?>" />
</head>