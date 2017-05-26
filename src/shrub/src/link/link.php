<?PHP
require_once __DIR__."/simple_html_dom.php";
require_once __DIR__."/link_util.php";

require_once __DIR__."/link_itchio.php";
require_once __DIR__."/link_gamejolt.php";
require_once __DIR__."/link_dropbox.php";


function linkComplete_GetFromURI( $uri) {

	$link = link_Parse($uri);
	$contents = null;
	$broken = false;
	
	if ($link['valid']) {

		if ($link['domain'] == 'itch.io') {
			$html = file_get_html($link['full']);
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_ScrapeItchIO($html, $link);
			}
		} else if ($link['domain'] == 'gamejolt.com') {
			$uri = link_getGameJoltDataLink($link);
			$text = file_get_contents($uri);
			$broken = is_null($text) || trim($text) === '';
			if (!$broken) {
				$json = json_decode($text, true);
				$contents = link_ParseGameJolt($json, $link);
			}
		}  else if ($link['domain'] == 'dropbox.com') {
			$html = file_get_html($link['full']);
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_ScrapeDropbox($html, $link);
			}
		
		} else {
			
			//Guessing
			$platforms = link_GuessPlatforms($link['full']);
			if (count($platforms)) {
				$item = null;
				$item['platforms'] = $platforms;
				$contents['items'][] = $item;
			} else {
				$contents['items'] = null;
			}
			$contents['user-page'] = null;
			$contents['provider-name'] = 'Custom Site';
		}
	}
	
	$results['link'] = $link;
	$results['link-broken'] = $broken;
	$results['contents'] = $contents;
	return $results;
}



?>