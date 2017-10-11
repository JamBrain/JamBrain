<?PHP
require_once __DIR__."/link_util.php";

function link_GitHubPages( $html, $link ) {
	$item['version'] = null;		
	$item['name'] = $html -> find('title', 0) -> innertext;
	$item['platforms'] = [link_resolvePlaformAlias('web')];
	$item['valid'] = true;
	
	$items[] = $item;
	$response['items'] = $items;
	//$response['user-page'] = implode(".", [$link['subdomain'], $link['domain']]);
	$response['provider-name'] = 'GitHub';
	
	return $response;
	
}

function link_GitHub( $html, $link ) {
	
	$rel_parts = explode('/', $link['relative']);
	
	$items = array();
	if (count($rel_parts) > 3 && $rel_parts[3] == 'releases') {
		//Release
		$tag = $html -> find('.tag-references', 0) -> children(0) -> children(0) -> href;
		$tag = explode('/', $tag);
		$version = $tag;
		foreach($html -> find('.release-downloads', 0) -> find("li") as $downloads) {
			$item = null;
			$item['name'] = $downloads -> find('a', 0) -> find('strong', 0) -> innertext;
			$item['platforms'] = link_GuessPlatforms($item['name']);			
			$item['version'] = $tag[count($tag) - 1];
			$item['valid'] = count($item['platforms']) > 0;
			array_push($items, $item);
		}
		
	} else {
		//Source
		$item['name'] = $html -> find('title', 0) -> innertext;
		$item['version'] = trim($html -> find('.commit-tease-sha', 0) -> innertext);	
		$item['platforms'] = [link_resolvePlaformAlias('source')];
		$item['valid'] = true;
		$items[] = $item;
	}
	
	$response['items'] = $items;
	$response['user-page'] = $link['protocol'] . implode(".", [$link['subdomain'], $link['domain']]) . '/' . explode('/', $link['relative'])[1];
	$response['provider-name'] = 'GitHub';
	
	return $response;
	
}

function link_GitHubLinkAsReleaseDownload($link) {
	$rel_parts = explode('/', $link['relative']);
	if (count($rel_parts) === 7 && $rel_parts[3] === 'releases' && $rel_parts[4] === 'download') {
		$item['version'] = $rel_parts[5];		
		$item['name'] = $rel_parts[6];
		$item['platforms'] = link_GuessPlatforms($item['name']);
		$item['valid'] = count($item['platforms']) > 0;
		
		$items[] = $item;
		$response['items'] = $items;
		$response['user-page'] = $link['protocol'] . implode(".", [$link['subdomain'], $link['domain']]) . "/" . $rel_parts[1];
		$response['provider-name'] = 'GitHub';
		
		return $response;
	}
}
?>