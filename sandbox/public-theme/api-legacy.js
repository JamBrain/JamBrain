
;(function(){

window.legacy_Logout = function( on_success ) {
	return xhr_PostJSON(
		"/api-legacy.php",
		serialize({"action":"LOGOUT"}),
		on_success
	);
}

window.legacy_DoLogout = function( reload ) {
	legacy_Logout(
		function(response,code) {
			console.log(response);

			cache_FlushUserData();

			if ( reload ) {
				location.reload();
			}
		}
	);
}

})();
