<?php 
	if (!isset($GLOBALS['HTML_NO_FOOTER'])) {
		if (isset($GLOBALS['HTML_SHOW_FOOTER'])) {
			echo "<!-- ";
		}
		else {
			//if (isset($_GET['debug'])) {
				echo "<script>function __(){alert(
					'Helpful Debug Info:\\n\\n'+
					'[window]: '+window.innerWidth+' x '+window.innerHeight+' ('+window.outerWidth+' x '+window.outerHeight+')\\n'+
					'[screen]: '+screen.width+' x '+screen.height+'\\n'+
					'[language]: '+navigator.language+'\\n'+
					'[languages]: '+navigator.languages+'\\n'+
					'[date]: '+Date(Date.now())+'\\n'+
					'[user agent]: '+navigator.userAgent+'\\n'+
					''
				);}</script>";
			//}
			echo "<div class='footer'>";
		}

		if (defined('VERSION')) {
			echo "[v".VERSION."] ";
		}
		
		$FOOTER_DATA_POINT=0; 		
		echo "Generated in <strong onclick='__();'>".core_GetExecutionTime()."</strong>";
		
		if (function_exists('db_GetQueryCount')) { 
			if ($FOOTER_DATA_POINT++ > 0) { echo ','; }
			echo ' using ' . db_GetQueryCount() . ((db_GetQueryCount() == 1)?' query':' queries');
		}
		if (function_exists('cache_GetReads')) {
			if ($FOOTER_DATA_POINT++ > 0) { echo ','; } 
			echo ' ' . cache_GetReads() . ' cache read(s), '. cache_GetWrites() .' cache write(s)';
		}

		if (function_exists('opcache_is_script_cached')) {
			// Technically, this is checking if "footer.html.php" isn't cached //
			if (!opcache_is_script_cached(__FILE__)) {
				if ($FOOTER_DATA_POINT++ > 0) { echo ','; }
				echo " with opcache disabled";
			}
		}
		else {
			if ($FOOTER_DATA_POINT++ > 0) { echo ','; }
			echo " without opcache";
		}
				
		echo " <span class='view-mode'></span>";

		echo (isset($GLOBALS['HTML_SHOW_FOOTER'])) ? ' -->' : '</div>'; 
	}
?>

</body>
</html>