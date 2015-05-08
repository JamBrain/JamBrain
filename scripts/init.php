<?php

	$table_prefix = "cmw_";

	$node_table = $table_prefix . "node";
	$link_table = $table_prefix . "link";
	$user_table = $table_prefix . "user";


	$query = 
		"CREATE TABLE " . $node_table . " (
			id BIGINT UNSIGNED NOT NULL 
				UNIQUE,
			parent BIGINT UNSIGNED NOT NULL
				DEFAULT 0,
			info BIGINT UNSIGNED NOT NULL 
				DEFAULT 0,
			
			type VARCHAR(16) NOT NULL,
				INDEX (type),
			
			time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			time_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
			time_published TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
				INDEX (time_published),

			slug VARCHAR(64) NOT NULL,
			name TEXT NOT NULL,
			body TEXT NOT NULL,
			
			score INT NOT NULL,
			love_cache INT NOT NULL,
			
			link_cache TEXT NOT NULL
		);";
	
	// Posts (everything) -- Get, is PUBLISHED=true, sort by PUBLISHED, LIMIT 10
	// Posts (popular) -- Get, is PUBLISHED=true, is LOVE >= 6 sort by PUBLISHED, LIMIT 10
	// Posts (favourites) -- Get Favourites (INT), is PUBLISHED=true, is AUTHOR=(IN Favourites), sort by PUBLISHED, LIMIT 10
	// Posts (league) -- Get, is PUBLISHED=true, is LEAGUE=value, sort PUBLISHED, LIMIT 10
	// Posts (hybrid) -- Combine the logic. Standard feed is Popular, Favourites and League
	// Comments -- For ItemID, get: PARENT=ItemID, TYPE="comment", is PUBLISHED=true, sort by PUBLISHED
	// Games -- Get EventID, is PUBLISHED=true, PARENT=EventID, etc...
	   // Combined Score
	   // By Coolness
	   // By Least Votes
	   // By SMARTS. No need to pull all 3000 games per request.
	
	$query = 
		"CREATE TABLE " . $link_table . " (
			id_a BIGINT UNSIGNED NOT NULL,
				INDEX(id_a),
			id_b BIGINT UNSIGNED NOT NULL
				DEFAULT 0,
				INDEX(id_b),
			id_other BIGINT UNSIGNED NOT NULL,

			type VARCHAR(16) NOT NULL,
				INDEX (type),
			subtype VARCHAR(16) NOT NULL
				DEFAULT '',
			subsubtype VARCHAR(16) NOT NULL
				DEFAULT '',
			//	INDEX(type,subtype,subsubtype)
			
			//INDEX(id_a,id_b,type), // 32 bytes total (8+8+16)
				
			value BIGINT NOT NULL
				DEFAULT 0,
			data TEXT NOT NULL
		);";
	
	// Need to be able to describe:
	// var->key->key = value
	// var->key[index] = value		(insert)
	// var->key[] = value			(push)
	
	// USER
	// id 0 0 "social,twitter,name" "mikekasprzak"			json[social][twitter][name]
	// id 0 0 "social,facebook,name" "chubby wubby"
	// id 0 0 "social,twitch,name" "povrazor"
	// id 0 0 "social,twitch,id" "1920470160614"
	
	// GAME
	   // Who worked on it? Who can edit it?
	// id author_id order "author,admin,[]" !author_id!           (can edit entry)
	// id author_id order "author,[admin]," !author_id!           
	// id author_id order "author,[admin],7" !author_id!           
	// id author_id order "author,contributor,[]" !author_id!     (only gets credit for it)
	// id 0 order         "author,stub,[]" "username"             (stub user, without an account)
	   // Authors are okay because they are global.

	   // Screenshots, Videos, Downloads //
	// id event_id 0  "media,shot,url" "http://blah.com/boo.png"
	// id event_id 0  "media,video,url" "http://youtube.com/blah"
	// id event_id ?? "media,download,url" "http://blah.com/mydownload.zip"
	// id event_id ?? "media,download,name" "Pablo Wins"
	// - platform_id is Windows, Linux (Any, 32, 64), Android, etc. Pre-cache and store all platforms on game pages.
	   // How do I find all Linux Games? HTML5 Games? Unity Player Games? Flash Games?
	   // How do I find all Unity Games?
	// id event_id tool_id "tool,," ""
	
	   // Embed Info //
	// id 0 640 "embed,width" "640"
	// id 0 480 "embed,height" "480"
	// id 0 0 "embed,url" "zeebra.com/mygame"
	// id 0 300 "embed,tw_width" "300"     (twitter embed width and height)
	// id 0 200 "embed,tw_hegiht" "200"

	   // How many Teams? How many Solo Devs?
	// an SQL query that does a count.
	   // All games made by teams?
	
	
	// Private Data (Email, Password Hash). Never send these. //
	$query = 
		"CREATE TABLE " . $user_table . " (
			id BIGINT UNSIGNED NOT NULL UNIQUE,
			node BIGINT UNSIGNED NOT NULL,

			mail TEXT NOT NULL UNIQUE,
			hash TEXT NOT NULL,
		);";
			
		
//			service_id TINYINT UNSIGNED NOT NULL,
//			user_id VARCHAR(32) NOT NULL,
//			PRIMARY KEY ID (service_id,user_id),
//			
//			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//				ON UPDATE CURRENT_TIMESTAMP,
//				INDEX (timestamp),
//			
//			name VARCHAR(32) NOT NULL,
//			display_name VARCHAR(32) NOT NULL,					
//			site_id BIGINT UNSIGNED NOT NULL,
//			media_id VARCHAR(32) NOT NULL,
//			followers BIGINT UNSIGNED NOT NULL,
//			viewers BIGINT UNSIGNED NOT NULL,
//			avatar TEXT NOT NULL,
//			url TEXT NOT NULL,
//			embed_url TEXT NOT NULL,
//			status TEXT NOT NULL,
//			mature BOOLEAN NOT NULL,
//								
//			units BIGINT UNSIGNED NOT NULL,
//			score BIGINT UNSIGNED NOT NULL

?>