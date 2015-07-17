<?php echo (isset($GLOBALS['HIDE_FOOTER_STATS'])) ? '<!-- ' : '<div class="footer">'; ?>
	<?php $FOOTER_DATA_POINT=0; ?>Generated in <strong><?php php_GetExecutionTime(true); ?></strong><?php $FOOTER_DATA_POINT++; if ( function_exists('db_GetQueryCount') ) { echo ' using ' . db_GetQueryCount() . ' queries'; } ?><?php if ( function_exists('cache_GetReads') ) { if ($FOOTER_DATA_POINT++ > 0) { echo ','; } echo ' ' . cache_GetReads() . ' cache read(s), '. cache_GetWrites() .' cache write(s)'; } ?>
<?php echo (isset($GLOBALS['HIDE_FOOTER_STATS'])) ? ' -->' : '</div>'; ?>
</html>