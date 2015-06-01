<?php
require_once __DIR__ . "/../db.php";

db_connect();
echo "Connected: " . db_isConnected() . "\n";

// NOTE: Indexes must be less than 767 bytes!
//   That means 255 (255.666~) for strings in UTF8 (UTF8mb3)
//   or 191 (191.75) for strings in UTF8mb4 (What I am using).
//   This *can* be bumped to 3072 with --innodb_large_prefix, but
//   the implications of this are not well understood (by me).

// https://dev.mysql.com/doc/refman/5.5/en/innodb-restrictions.html
// https://make.wordpress.org/core/2015/04/02/the-utf8mb4-upgrade/

// Consider using a simpler charset and coalation for slugs and slug-lookup tables (they only need ASCII 0-127)

// http://code.openark.org/blog/mysql/mysqls-character-sets-and-collations-demystified

	$table_prefix = "cmw_";

	$node_table = $table_prefix . "node";
	$link_table = $table_prefix . "link";

	$user_table = $table_prefix . "user";
	$love_table = $table_prefix . "love";
	$star_table = $table_prefix . "star";
		
	db_query("DROP TABLE " . $node_table . ";",true);
	db_query("DROP TABLE " . $link_table . ";",true);
	db_query("DROP TABLE " . $user_table . ";",true);
	db_query("DROP TABLE " . $love_table . ";",true);
	db_query("DROP TABLE " . $star_table . ";",true);
		
	db_query("SET storage_engine=InnoDB;");
//	db_query("SET collation_server=utf8_unicode_ci;");
//	db_query("SET character_set_server=utf8;");
	
	const DBTYPE_INNODB = " ENGINE=InnoDB";
	const DBTYPE_MYISAM = " ENGINE=MyISAM";
	const DBTYPE_ARCHIVE = " ENGINE=Archive";
	// NOTE: utf8 is 3 byte unicode. utf8mb4 is 4 byte. Required for Emoji.
	const CSTYPE_UTF8 = " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
	const CSTYPE_LATIN = " CHARACTER SET latin1 COLLATE latin1_swedish_ci";		// Case Insensitive
	//const CSTYPE_LATIN = " CHARACTER SET latin1 COLLATE latin1_bin";			// Case Sensitive
	
	// https://dev.mysql.com/doc/refman/5.5/en/case-sensitivity.html
	
	
	$dbtype_default = DBTYPE_INNODB . CSTYPE_UTF8;

	// id - The Unique ID of the Node
	// parent - Who I'm a child of (if anyone)
	// root - Who owns me (Node)
	// author - Who wrote and published the Node (not necessarily who changed it).
	// type - What are we (What kind of Node)?
	// time - Timestamps
	// slug - Clean name for URLs
	// name - Proper name
	// body - body or description

	// comment_count - How many Comments
	// love_count - How much Love
	// favourite_count - How many Favourites
	// popularity - some metric used to single out posts ** (may want to sort by)

	// link_cache - cached list of references (links) in JSON format.
	db_query(
		"CREATE TABLE " . $node_table . " (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
			parent BIGINT UNSIGNED NOT NULL DEFAULT 0,
			root BIGINT UNSIGNED NOT NULL DEFAULT 0,
				
			author BIGINT UNSIGNED NOT NULL DEFAULT 0,
				INDEX (author),

			type VARCHAR(16) CHARSET latin1 NOT NULL DEFAULT '',
				INDEX (type),
			
			time_created DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
			time_modified DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
			time_published DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
				INDEX (time_published),

			slug VARCHAR(64) CHARSET latin1 NOT NULL DEFAULT '',
			name VARCHAR(191) NOT NULL DEFAULT '',
			body MEDIUMTEXT NOT NULL,

			
			comment_count INT NOT NULL DEFAULT 0,
			love_count INT NOT NULL DEFAULT 0,
			favourite_count INT NOT NULL DEFAULT 0,
			popularity INT NOT NULL DEFAULT 0,
			
			link_cache TEXT NOT NULL,
			favourite_cache TEXT NOT NULL
		)" . $dbtype_default . ";");
	
	
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
	// Download -- Parent=Game, Info=Platform, Body=URL, Name=Title (if not Parent name)
	
	
	db_query(
		"CREATE TABLE " . $link_table . " (
			id_a BIGINT UNSIGNED NOT NULL DEFAULT 0,
				INDEX(id_a),
			id_b BIGINT UNSIGNED NOT NULL DEFAULT 0,
				INDEX(id_b),

			type VARCHAR(16) CHARSET latin1 NOT NULL DEFAULT '',
				INDEX (type),
			subtype VARCHAR(16) CHARSET latin1 NOT NULL DEFAULT '',
			
			/*INDEX(id_a,id_b,type),*/
				
			data TEXT NOT NULL
		)" . $dbtype_default . ";");

/*
Thing {
	'author':{
		'creator':{
			'id':4098571,
			'text':""
		},
		'team':[
			{
				'id':385131,
				'text':""
			},
			{
				'id':4912,
				'text':""
			}
		],
		'stub':[
			{
				'text':"jummy"
			},
			{
				'text':"bibo"
			}
		]
	}	
};


Thing {
	'author':{
		'creator':4098571,
		'team':[
			385131,
			4912
		],
		'stub':[
			"jummy",
			"bibo"
		]
	}	
};


*/
	// id author_id "author,creator" ""              **STORE ID_B**






	
	// Need to be able to describe:
	// var->key->key = value
	// var->key[index] = value		(insert)
	// var->key[] = value			(push)
	
	// USER
	// id 0 0 "social,twitter,name" "mikekasprzak"			json[social][twitter][name]
	// id 0 0 "social,facebook,name" "chubby wubby"
	// id 0 0 "social,twitch,name" "povrazor"
	// id 0 0 "social,twitch,id" "1920470160614"
	// id 0 0 "avatar,," "image.png"	
	
	// GAME
	   // Who worked on it? Who can edit it?
	// id author_id 0 "author,admin,[]" !author_id!           (can edit entry)
	// id author_id 0 "author,[admin]," !author_id!           
	// id author_id 0 "author,[admin],7" !author_id!           
	// id author_id 0 "author,contributor,[]" !author_id!     (only gets credit for it)
	// id 0 0         "author,stub,[]" "username"             (stub user, without an account)
	   // Authors are okay because they are global.

	   // Screenshots, Videos, Downloads //
	// id event_id 0  "media,shot,url" "http://blah.com/boo.png"
	// id event_id 0  "media,video,url" "http://youtube.com/blah"
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
	db_query(
		"CREATE TABLE " . $user_table . " (
			id BIGINT UNSIGNED NOT NULL UNIQUE,
				INDEX(id),

			mail VARCHAR(191) NOT NULL UNIQUE,
				INDEX(mail),
				
			hash VARCHAR(128) NOT NULL
		)" . $dbtype_default . ";");
	// As of PHP 5.5, password_hash uses bcrypt which needs 60 chars.
	// Various articles recommend making it 255 chars, but as of 2015 we don't need it yet.
	// My compromise is to set it to 128 chars, though we don't need more than 64.
	// When PHP switches to a fancier algorithm, then we'll do an alter-table to add more space.
	
	// Love Table. If a user has given a +1 to something. //
	db_query(
		"CREATE TABLE " . $love_table . " (
			node BIGINT UNSIGNED NOT NULL,
				INDEX(node),
			user BIGINT UNSIGNED NOT NULL,
				INDEX node_user(node,user),
			ip INT UNSIGNED NOT NULL,
				UNIQUE node_user_ip(node,user,ip)
		)" . $dbtype_default . ";");
	// for IP queries, use INET_ATON() and INET_NTOA().
	// http://dev.mysql.com/doc/refman/5.0/en/miscellaneous-functions.html#function_inet-aton
	// ipv6 forget about it for now //

	// Star Table. If a user has favourited something (so they can view it later). //
	db_query(
		"CREATE TABLE " . $star_table . " (
			node BIGINT UNSIGNED NOT NULL,
				INDEX(node),
			user BIGINT UNSIGNED NOT NULL,
				INDEX(user),
			UNIQUE node_user(node,user)
		)" . $dbtype_default . ";");
	// No need for an IP. Users only. //


//	$query = 
//		"CREATE TABLE " . $log_table . " (
//			node BIGINT UNSIGNED NOT NULL,
//			user BIGINT UNSIGNED NOT NULL,
//			ip INT UNSIGNED NOT NULL
//		) ENGINE=archive;";

	// Database Engines //
	// InnoDB (DairyBox Default) - 
	// MyISAM (Server Default) - 
	// Archive - 
	
	echo "This script doesn't do mich\n";
?>