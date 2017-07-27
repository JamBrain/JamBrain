<?PHP
require_once __DIR__."/link_util.php";

function link_getGameJoltDataLink($link) {
	$parts = explode('/', $link['without_params']);
	$last = count($parts) - 1;
	if (trim($parts[$last]) === '') {
		$game_id = $parts[$last - 1];
	} else {
		$game_id = $parts[$last];
	}
	$uri = 'https://gamejolt.com/site-api/web/discover/games/' . $game_id;
	
	return $uri;
}

function link_ParseGameJolt($json, $link) {
	$user = $json['payload']['game']['developer']['url'];
	$response['items'] = array();
	
	$item['name'] = $json['payload']['game']['title'];
	$platforms = array();
	
	foreach($json['payload']['game']['compatibility'] as $compat => $val) {
		if ($val === true && substr($compat, 0, 3) === 'os_') {			
			$platform = link_resolvePlaformAlias(explode('_', $compat)[1]);
			if ($platform !== null) {
				array_push($platforms, $platform);
			}
		} else if ($val === true && $compat == 'type_html') {
			$web_item['platforms'] = [link_resolvePlaformAlias('html')];
			$web_item['name'] = $json['payload']['game']['title'];
			$web_item['valid'] = true;
			$web_item['uri'] = null;
			$web_item['version'] = $json['payload']['game']['modified_on'];			
			array_push($response['items'], $web_item);
		}
	}
	if (count($platforms) === 0) {
		$item['error-message'] = 'You have not specified platforms on Game Jolt. Please fix this.';
		$item['valid'] = false;
	} else {
		$item['platforms'] = $platforms;
		$item['valid'] = false;
	}
	$item['version'] = $json['payload']['game']['modified_on'];
	array_push($response['items'], $item);
	$response['user-page'] = implode("", ["gamejolt.com", $user]);
	$response['provider-name'] = 'Game Jolt';

	return $response;
}

function link_ScrapeGameJolt( $html, $link ) {
	
	//TODO: Handle lazy loading? Or just don't care about gamejolt?
	
	//Releases
	$items = array();
	foreach($html->find('gj-game-package-card') as $release) {	
		$name = $release -> find('.card-title', 0) -> children(0) -> innertext;
		
		foreach($release -> find('button') as $button) {
			$item = null;
			$item['uri'] = null;
			$item['name'] = $name;
			$item['version'] = null; 
			$item['platforms'] = array();
			
			foreach($button -> find('span') as $platform) {
				if (strpos($platform -> innertext, 'html5' )) {
					array_push($item['platforms'], link_resolvePlaformAlias('html5'));
				} else if (strpos($platform -> innertext, 'html5' )) {
					array_push($item['platforms'], link_resolvePlaformAlias('windows'));
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
	}
	$user = '';
	$response['items'] = $items;
	$response['user-page'] = implode("/", ["gamejolt.com", $user]);
	$response['provider-name'] = 'Game Jolt';

	return $response;
}
?>