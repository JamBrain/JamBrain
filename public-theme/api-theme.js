
;(function(){

window.theme_AddIdea = function( Idea, on_success ) {
	return xhr_PostJSON(
		"/api-theme.php",
		serialize({"action":"ADD","idea":Idea}),
		on_success
	);
}
window.theme_RemoveIdea = function( Id, on_success ) {
	return xhr_PostJSON(
		"/api-theme.php",
		serialize({"action":"REMOVE","id":Id}),
		on_success
	);
}

window.theme_GetMyIdeas = function( on_success ) {
	return xhr_PostJSON(
		"/api-theme.php",//?debug",
		serialize({"action":"GETMY"}),
		on_success
	);
}
window.theme_GetMyOtherIdeas = function( on_success ) {
	var key = "@THEME|MyOtherIdeas";
	if (cache_Exists(key)) {
		return on_success(cache_Fetch(key));
	}
	else {
		return xhr_PostJSON(
			"/api-theme.php",//?debug",
			serialize({"action":"GETMYOTHER"}),
			function(response,code) {
				cache_Store(key,response);
				on_success(response,code);
			}
		);
	}
}


window.theme_MakeHash = function(_key) {
	return _key.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

window.theme_GetHistory = function( on_success ) {
	var key = "@THEME|History";
	if (cache_Exists(key)) {
		return on_success(cache_Fetch(key));
	}
	else {
		return xhr_GetJSON(
			"/api-theme.php?action=HISTORY",
			// On success //
			function(response,code) {
				console.log("HISTORY:",response);
				
				// Determine success //
				if ( response.theme ) {
					var HashTable = {};
					
					for ( var idx = 0; idx < response.theme.length; idx++ ) {
						var _key = response.theme[idx].theme;
						HashTable[theme_MakeHash(_key)] = response.theme[idx];
					}
					
					cache_Store(key,HashTable);
					return on_success(HashTable,code);
				}
				return on_success(null,code);
			}
		);
	}
}


})();
