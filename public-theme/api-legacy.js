
;(function(){

window.legacy_Logout = function( success ) {
	return xhr_PostJSON(
		"/api-legacy.php",
		serialize({"action":"LOGOUT"}),
		success
	);
}

window.legacy_DoLogout = function( reload ) {
	legacy_Logout(
		function(response,code) {
			console.log(response);
			if ( reload ) {
				location.reload();
			}
		}
	);
}

})();
