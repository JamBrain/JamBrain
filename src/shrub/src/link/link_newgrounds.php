<?PHP
require_once __DIR__."/link_util.php";

function link_NewGrounds( $html, $link ) {
	
	$items = array();
	$item['version'] = null;
	$item['name'] = $html -> find('title', 0) -> innertext;
	$item['platforms'] = link_resolvePlaformAlias('web');
	$items[] = $item;		
	
	$response['items'] = $items;
	$response['user-page'] = $html -> find('.authorlinks', 0) -> find('a', 0) -> href;
	$response['provider-name'] = 'Kongregate';
	
	return $response;

}

?>