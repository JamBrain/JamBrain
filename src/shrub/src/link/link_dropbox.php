<?PHP
require_once __DIR__."/link_util.php";

function link_ScrapeDropbox( $html, $link ) {
	$item['version'] = null;
		//substr($html -> find('.preview-box', 0) -> children(0) -> getAttribute('class'), 9);
	$item['name'] = $html -> find('title', 0) -> innertext;
	$item['platforms'] = link_GuessPlatforms($item['name']);
	
	$items[] = $item;
	$response['items'] = $items;
	$response['user-page'] = implode(".", [$link['subdomain'], $link['domain']]);
	$response['provider-name'] = 'Dropbox';
	
	return $response;

}

?>