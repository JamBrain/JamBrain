<?

function link_resolvePlaformAlias($platform) {
	$platform = strtolower(trim($platform));
	
	switch($platform) {
		case "win":
		case "windows":
			return "Windows";
		case "mac":
		case "macos":
			return "macOS";
		case "linux":
			return "Linux";
		case "web":
		case "webgl":
		case "html":
			return "webGL";
		case "android":
			return "Android";
		case "source":
			return "Source";
	}
}

function link_GuessPlatforms($text) {
	if (strpos($text, '.jar') !== false) {
		return [
			link_resolvePlaformAlias('windows'),
			link_resolvePlaformAlias('macOS'),
			link_resolvePlaformAlias('linux')
		];
	}

	$platforms = array();
	$lowertext = strtolower($text);
	
	if (strpos($lowertext, 'win') !== false) {
		array_push($platforms, link_resolvePlaformAlias('windows'));
	}
	if (strpos($lowertext, 'mac') !== false) {
		array_push($platforms, link_resolvePlaformAlias('macOS'));
	}
	if (strpos($lowertext, 'linux') !== false) {
		array_push($platforms, link_resolvePlaformAlias('linux'));
	}
	if (strpos($lowertext, 'android') !== false) {
		array_push($platforms, link_resolvePlaformAlias('android'));
	}
	
	if (count($platforms) === 0) {
		if (strpos($lowertext, 'web') !== false || strpos($lowertext, 'html') !== false){ 
			array_push($platforms, link_resolvePlaformAlias('web'));
		}
		if (strpos($lowertext, 'source') !== false){ 
			array_push($platforms, link_resolvePlaformAlias('source'));
		}
	}
	
	return $platforms;
}

function link_Parse( $uri, $default_protocol = 'http://' ) {
	$protocol_end = strpos($uri, '://');
	$valid = true;
	if ($protocol_end === false) {
		$protocol = $default_protocol;
		$domain_start = 0;
		$full_uri = $protocol . $uri;
	} else {
		$protocol = substr($uri, 0, $protocol_end + 3);
		$domain_start = $protocol_end + 3;
		$full_uri = $uri;
	}
	
	$domain_end = strpos($uri, '/', $domain_start);
	$relative = null;	
	
	if ($domain_end === false) {
		$domain = null;
		$subdomain = null;
		$valid = false;
	} else {
		$domain_parts = explode('.', substr($uri, $domain_start, $domain_end - $domain_start));
		$n_parts = count($domain_parts);
		switch ($n_parts) {
			case 1:
				$domain = null;
				$subdomain = null;
				$valid = false;
				break;
			case 2:
				$domain = implode('.', $domain_parts);
				$subdomain = null;
				break;
			case 3:
				if ($domain_parts[$n_parts - 2] === 'co' && $domain_parts[$n_parts - 1] === 'uk') {
					$domain = implode('.', $domain_parts);
					$subdomain = null;
				} else {
					$domain = implode('.', array_slice($domain_parts, 1));
					$subdomain = $domain_parts[0];
				}
				break;
			case 4:
				if ($domain_parts[$n_parts - 2] === 'co' && $domain_parts[$n_parts - 1] === 'uk') {
					$domain = implode('.', array_slice($domain_parts, 1));
					$subdomain = $domain_parts[0];
				} else {
					$domain = implode('.', array_slice($domain_parts, 1));
					$subdomain = $domain_parts[0];
					$valid = false;										
				}
				break;
			default:
				$domain = implode('.', array_slice($domain_parts, 1));
				$subdomain = $domain_parts[0];
				$valid = false;										
				break;		
		}
		
		$relative = substr($uri, $domain_end);
	}

	$params_start = strpos($uri, '?');
	if ($params_start === false) {
		$params = null;
		$without_params = $uri;
	} else {
		$params = substr($uri, $params_start + 1);
		$without_params = substr($uri, 0, $params_start);
		if ($relative !== null) {
			$relative = substr($relative, 0, strpos($relative, '?'));
		}
	}
	
	$link['valid'] = $valid;
	$link['protocol'] = $protocol;
	$link['domain'] = $domain;
	$link['subdomain'] = $subdomain;
	$link['original'] = $uri;
	$link['full'] = $full_uri;
	$link['relative'] = $relative;
	$link['params'] = $params;
	$link['without_params'] = $without_params;
	return $link;	
}

function link_GetParamValue($params, $key) {
	$params = explode('+', $params);
	foreach($params as $value) {		
		$kvp = explode('=', $value);		
		if ($kvp[0] === $key) {
			return $kvp[1];
		}		
	}
}

?>