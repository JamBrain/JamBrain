<?php

// Validate and Sanitize Things
// - Validate functions return whether they are valid or not
// - Sanitize functions return a legal string, or false on failure


// Given a URL, returns a valid (escaped) URL, or false if it's bad. //
//function validate_url($url) {
function sanitize_url($url) {
	// Step 0. Confirm that the input is UTF-8 encoded.
	if ( !mb_check_encoding($url, 'UTF-8') ) {
		// ERROR: Expected URL in UTF-8 encoding.
		return false;
	}
	
	// Step 1. Trim whitespace. This should be multibyte friendly: http://stackoverflow.com/a/10067670
	$url = trim($url);
	
	// Step 2. Confirm that it's a valid URL (i.e. has a scheme).  http://en.wikipedia.org/wiki/URI_scheme
	$protocols = [
		// Standard URLs (scheme://path/?query).
		'http', 'https',
		'ftp', 'sftp',
		//'file',					// **DO NOT ENABLE**. By ignoring file://, we help unsavvy users.

		// Non-file URLs.
		//'telnet',					// ... undecided if we need this.
		//'ssh',					// ... also undecided. Some version control softwares uses this as secure.
		'git', 'svn', 'cvs',		// Version Control. git://user@server:path/to/repo.git
		'irc', 'irc6', 'ircs',		// Text Chat.		irc://irc.afternet.org:6667/ludumdare
		'rtmp', 'rtmfp',			// Video.			rtmp://mycompany.com/vod/mp4:mycoolvideo.mov
		'ventrilo',	'mumble',		// Audio Chat.		ventrilo://www.myserver.com:3784/servername=MyServer
		'ts3server',				// Audio Chat.		ts3server://IPADDRESS/?port=YOUR_PORT&nickname=Web+Guest
		'steam',					// Steam Client.	steam://<action>/<id, addon, IP, hostname, etc.>
		
		// Other URLs.
		'mailto',					// mailto:me@somewebsite.com?subject=hey+dawg
		'magnet',					// magnet:?xt=urn:sha1:YNCKHTQCWBTRNJIV4WNAE52SJUQCZO5C
		//'bitcoin',				// ... undecided if we should allow this or not.
		'about', 'opera', 'chrome',	// Web-browser internal.
	];
	
	// NOTE: parse_url isn't multibyte aware, so you should only rely on scheme and the existence of other members.
	
	$parsed = parse_url($url);
	$protocol = false;
	// If a scheme is set //
	if ( isset($parsed['scheme']) ) {
		foreach ( $protocols as $item ) {
			if ( $item === strtolower($parsed['scheme']) ) {
				$protocol = $item;
				break;
			}
		}
	}
	else {
		// If no scheme is set, but there is a path, assume it's http.
		if ( isset($parsed['path']) ) {
			$url = 'http://' . $url;
			$protocol = 'http';
		}
		// TBD: Do we limit this feature to url's prefixed with 'www.'?
	}
	if ( $protocol === false ) {
		// ERROR: Unknown URL scheme.
		return false;
	}
	// We now know the protocol. It will always be lower case.
	
	// Step 3. Escape URL.
	$url = htmlspecialchars($url,ENT_QUOTES|ENT_HTML5,'UTF-8',false);
	// TBD: do we want ENT_HTML5 above? http://stackoverflow.com/a/14532168
//	if ( $url === false ) {
//		// ERROR: Invalid URL.
//		return false;
//	}
	
	return $url;
}

function sanitize_email($mail) {
	$mail = trim(strip_tags($mail));
	
	if ( !filter_var($mail, FILTER_VALIDATE_EMAIL) ) {
		return false;
	}
	
	return $mail;
}

function sanitize_slug($slug) {
	$slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug);	// Remove accents
	$slug = strip_tags($slug);									// No HTML/XML tags
	$slug = strtolower($slug);									// Lower case only
	$slug = preg_replace("/[^a-z0-9\/_|'. -]/", '', $slug);		// Keep only these
	$slug = preg_replace("/[\/_| -'.]+/", '-', $slug);			// All of these to a single dash
	$slug = trim($slug, '-');									// Remove dashes from start and end
	
	if ( empty($slug) )
		return false;
	else
		return $slug;
}

?>