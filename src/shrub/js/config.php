<?php
function core_GetSecondLevelDomain() {
	$dom = $_SERVER['HTTP_HOST'];
	$dot1 = strrpos($dom, ".");
	$dot1 = $dot1 !== false ? $dot1 : strlen($dom);
	$dot2 = strrpos($dom, ".", -(strlen($dom)-($dot1-1)));
	$dot2 = $dot2 !== false ? $dot2+1 : 0;
	
	return substr($dom, $dot2);
}
?>
<script>
	window.SH_DOMAIN = 'api.<?=core_GetSecondLevelDomain()?>';
	window.SH_ENDPOINT = '/vx';
</script>