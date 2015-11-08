<?php 
	if (!isset($GLOBALS['HTML_NO_FOOTER'])) {
		echo (isset($GLOBALS['HTML_SHOW_FOOTER'])) ? '<!-- ' : '<div class="footer">';
		
		$FOOTER_DATA_POINT=0; 
		
		if (function_exists('opcache_is_script_cached')) {
			echo ' ' . (opcache_is_script_cached(__FILE__) ? "Executed" : "Compiled and Executed");
		}
		else {
			echo "Generated";
		}
		
		echo " in <strong>".php_GetExecutionTime()."</strong>";
		
		if (function_exists('db_GetQueryCount')) { 
			if ($FOOTER_DATA_POINT++ > 0) { echo ','; } 
			echo ' using ' . db_GetQueryCount() . ' queries';
		}
		if (function_exists('cache_GetReads')) {
			if ($FOOTER_DATA_POINT++ > 0) { echo ','; } 
			echo ' ' . cache_GetReads() . ' cache read(s), '. cache_GetWrites() .' cache write(s)';
		}

		echo (isset($GLOBALS['HTML_SHOW_FOOTER'])) ? ' -->' : '</div>'; 
	}
?>

</body>
</html>