
// We only care about 2 things:
// - If legacy Internet Explorer (versions before IE 11/Trident 7)
// - If the webkit android browser, not powered by chrome.
// Everything else is fair game, or we don't care enough to warn you.

// http://www.useragentstring.com/pages/Internet%20Explorer/

// Extract versions followed by a space or a slash. Case insensitive.
function ua_ExtractVersion(Str) {
	var ua = navigator.userAgent.toUpperCase();

	var StrUp = Str.toUpperCase();
	var Pos = ua.indexOf(StrUp);
	if ( Pos >= 0 ) {
		return parseFloat(ua.slice(Pos+StrUp.length+1));
	}
	return 0;
}

function ua_GetWindowsVersion() {
	return ua_ExtractVersion("Windows");
}
function ua_GetIEVersion() {
	return ua_ExtractVersion("MSIE");
}
function ua_GetTridentVersion() {
	return ua_ExtractVersion("Trident");
}

function ua_GetAndroidVersion() {
	return ua_ExtractVersion("Android");
}
function ua_GetChromeVersion() {
	return ua_ExtractVersion("Chrome");
}
function ua_GetWebkitVersion() {
	return ua_ExtractVersion("Mobile Safari");
}



// If you are running a legacy version of Internet Explorer
function ua_IsLegacyIE() {
	var Trident = ua_GetTridentVersion();
	var IE = ua_GetIEVersion();
	return ((Trident !== 0) && (Trident < 7.0)) || ((IE !== 0) && (IE < 11.0));
}

// If you can install Internet Explorer 11 on your PC
function ua_CanGetIE11() {
	return ua_GetWindowsVersion() >= 6.1;	// Windows 7 //
}

// If using the legacy Webkit powered Android browser (not Chrome)
function ua_IsLegacyAndroid() {
	return (ua_GetAndroidVersion() > 0) && (ua_GetWebkitVersion() > 0) && (ua_GetChromeVersion() === 0);
}

