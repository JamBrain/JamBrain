
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


})();
