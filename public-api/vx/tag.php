<?php
require_once __DIR__."/../config.php";

include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."api.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";

json_Begin();

// ********************* //

// Do Actions
$action = json_ArgShift();
switch ( $action ) {
	case 'get': //tag/get/:filter
		json_ValidateHTTPMethod('GET');

		$filter = json_ArgShift();
		// Disabled this because the cached name conflicts with "no filter"
//		if ( $filter == 'all' ) {
//			$filter = null;
//		}
//		else
		if ( $filter ) {
			$filter = coreSlugify_PathName($filter);
		}
		else {
			$filter = "";
		}

		$key = "SH_TAG_".($filter ? $filter : "");
		$ttl = 5*60;	// 5 minutes

		if ( cache_Exists($key) ) {
			$RESPONSE['tag'] = cache_Fetch($key);
			$RESPONSE['cached'] = true;
		}
		else {
//			$RESPONSE['tag'] = node_GetSimpleByType('tag', $filter);
			$tags = node_CustomGetTagByType('tag', $filter);

			// hack
			$icons = [
				'apple-mac' => 'apple',
				'apple-ios' => 'apple',
				'apple-other' => 'apple',
				'microsoft-windows' => 'windows',
				'linux' => 'linux',
				'google-android' => 'android',
				'html5-web' => 'html5',
				'source-code' => 'file-text',
				'document-pdf' => 'pdf',
			];

			$RESPONSE['tag'] = [];
			foreach ( $tags as &$tag ) {
				$out = [
					'id' => $tag['id'],
					'slug' => $tag['slug'],
					'name' => $tag['name'],
				];
				if ( is_string($tag['type']) && strlen($tag['type']) ) {
					$out['type'] = $tag['type'];
				}
				if ( isset($icons[$tag['slug']]) ) {
					$out['icon'] = $icons[$tag['slug']];
				}

				$RESPONSE['tag'][] = $out;
			}

			// only store it if there are actually results
			if ( count($RESPONSE['tag']) )
				cache_Store($key, $RESPONSE['tag'], $ttl);
		}

		break; // case 'get': //tag/get/:filter
	default:
		json_EmitFatalError_Forbidden(null, $RESPONSE);
		break; // default
};

json_End();
