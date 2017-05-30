<?PHP
require_once __DIR__."/simple_html_dom.php";
require_once __DIR__."/link_util.php";

require_once __DIR__."/link_itchio.php";
require_once __DIR__."/link_gamejolt.php";
require_once __DIR__."/link_dropbox.php";
require_once __DIR__."/link_github.php";
require_once __DIR__."/link_googledrive.php";
require_once __DIR__."/link_newgrounds.php";


function link_getExternal( $linkHash ) {
	//TODO: Implement database thing
	return 'http://www.ldjam.com';
}

function link_Ping( $linkHash, $isHash ) {
	
	if ($isHash === true) {
		$uri = link_getExternal($linkHash);
	} else {
		$uri = $linkHash;
	}
	if ($uri === null) {
		$ping['error'] = true;
		$ping['message'] = 'Unknown hash';
	}
	$headers = get_headers($uri, 1);
	if (is_null($headers) || count($headers) === 0) {
		$ping['error'] = true;
		$ping['message'] = 'No response';
	} else if (strpos($headers['0'], '200') === false) {
		$ping['error'] = true;
		$ping['message'] = $headers['0'];
	} else {
		$ping['error'] = false;
		$ping['message'] = $headers['0'];		
	}
	return $ping;
}

function linkComplete_GetFromURI( $uri) {

	$link = link_Parse($uri);
	$contents = null;

	$ping = link_Ping($link['full'], false);
	$broken = $ping['error'];
	
	if (!$broken && $link['valid']) {

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
		}  else if ($link['domain'] === 'dropbox.com') {

			$html = file_get_html($link['without_params'] . '?dl=0');
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_ScrapeDropbox($html, $link);
				if (count($contents['items']) === 1) {
					$link['suggest_update'] = link_DropboxDownloadLink($link);
					if ($link['suggest_update'] === $link['full']) {
						$link['suggest_update'] = null;
					}
				}
			}
		} else if ( $link['domain'] === 'dropboxusercontent.com' ) {
						
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
			$contents['provider-name'] = 'Dropbox';
		
		} else if ($link['domain'] == 'github.com'){
			//Github source
			$contents = link_GitHubLinkAsReleaseDownload($link);
				if ($contents === null) {
				$html = file_get_html($link['full']);
				$broken = is_null($html) || trim($html) === '';
				if (!$broken) {
					$contents = link_GitHub($html, $link);
				}
			}
		} else if ($link['domain'] == 'github.io') {
			//Github pages
			$html = file_get_html($link['full']);
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_GitHubPages($html, $link);
			}
		} else if (explode('.', $link['domain'])[0] === 'google' && $link['subdomain'] === 'drive' || $link['domain'] === 'goo.gl') {
			$html = file_get_html($link['full']);
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_GoogleDrive($html, $link);
			}
			//$contents['text'] = file_get_contents($uri);
		} else if ($link['domain'] === 'newgrounds.com') {
			$html = file_get_html($link['full']);
			$broken = is_null($html) || trim($html) === '';
			if (!$broken) {
				$contents = link_NewGrounds($html, $link);
			}
		}  else {
			
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