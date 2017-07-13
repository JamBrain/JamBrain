<?PHP
require_once __DIR__."/link_util.php";

function link_ScrapeItchIO( $html, $link ) {
	
	//Downloads
	$items = array();
	foreach($html->find('.upload') as $downloadable) {
		$item = null;
		$dl_link = $downloadable->find('a', 0);
		
		$item['name'] = $downloadable->find('.upload_name', 0)->find('strong', 0)->innertext;
		$item['platforms'] = array();
		
		if ($dl_link === null) {
			//This is a priced result
			$item['uri'] = null;
		} else {
			
			//This is a free result
			$item['version'] =  $dl_link -> getAttribute('data-upload_id');
			$game_link = link_Parse($dl_link -> href);
			$item['uri'] = $game_link['valid'] ? $game_link['original'] : null;
		}

		foreach ($downloadable->find('.download_platforms', 0) -> children() as $platform) {
			$platform_name = link_resolvePlaformAlias(substr($platform->getAttribute('title'), 13));
			if ($platform_name !== false) {
				array_push($item['platforms'], $platform_name);
			}
		}
		if (count($item['platforms']) === 0) {
			$item['error-message'] = 'You have forgotten to mark download type on your game on itch.io. Please fix this.';
			$item['valid'] = false;
		} else {
			$item['valid'] = true;
		}

		array_push($items, $item);
	}
	
	//Web
	$web = $html->find('div.game_frame');
	if (count($web) === 1) {
		$item = null;
		$item['name'] = ''; //TODO: How to resolve naming, needed?
		$item['version'] = null; //TODO: Unclear if any
		$item['platforms'][] =  link_resolvePlaformAlias('webGL');
		array_push($items, $item);
	}
	
	$response['items'] = $items;
	$response['user-page'] = implode(".", [$link['subdomain'], $link['domain']]);
	$response['provider-name'] = 'Itch.io';
	
	return $response;
}
?>