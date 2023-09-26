<?PHP
require_once __DIR__."/link_util.php";

function link_GoogleDrive( $html, $link ) {
	$item['version'] = link_GetParamValue($link['params'], 'id');		
	$title = $html -> find('title', 0) -> innertext;	
	$item['name'] = substr($title, 0, count($title) - 16);
	//$item['platforms'] = [link_resolvePlaformAlias('web')];
	$item['valid'] = false;
	
	$items[] = $item;
	$response['items'] = $items;
	//$response['user-page'] = implode(".", [$link['subdomain'], $link['domain']]);
	$response['provider-name'] = 'Google Drive';
	
	return $response;
	
}
?>