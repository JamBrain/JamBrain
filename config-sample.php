<?php

// General Config Information //
const CMW_USING_DB = true;
const CMW_USING_MYSQL = true;		// True if MySQL, PerconaDB, and MariaDB
//const CMW_USING_MARIADB = true;
//const CMW_USING_PDO = true;		// Default Database is MySQL. Enable this to use PDO.
const CMW_USING_APCU = true;
//const CMW_USING_MEMCACHED = true;
//const CMW_USING_REDIS = true;
const CMW_USING_MAGICK = true;
const CMW_USING_IMAGEMAGICK = true;
//const CMW_USING_GRAPHICSMAGICK = true;

// Database Config //
const CMW_DBIN_HOST = 'localhost';
const CMW_DBIN_NAME = 'database';
const CMW_DBIN_LOGIN = 'login';
const CMW_DBIN_PASSWORD = 'password';
const CMW_DBOUT_HOST = CMW_DBIN_HOST;
const CMW_DBOUT_NAME = CMW_DBIN_NAME
const CMW_DBOUT_LOGIN = CMW_DBIN_LOGIN;
const CMW_DBOUT_PASSWORD = CMW_DBIN_PASSWORD;

const CMW_TABLE_PREFIX = 'cmw_';

// Memcached Config //
const CMW_MEMCACHED_HOST = 'localhost';
const CMW_MEMCACHED_PORT = 11211;

// Redis Config //
const CMW_REDIS_HOST = 'localhost';

// Debug Flags //
const CMW_PHP_DEBUG = true;			// PHP Debug Mode: Extra logging, query debug features.
const CMW_JS_DEBUG = true;			// JavaScript Debug Mode: Not minified, src includes.
const CMW_CSS_DEBUG = true;			// CSS Debug Mode: Not minified, src includes.

// Paths //
const CMW_STATIC_DIR = '/public-static';
const CMW_STATIC_URL = '/static';
const CMW_THEME_BASE = '/themes';

// Access Permission Whitelist (Can be arrays on PHP 5.6+) //
const CMW_ACCESS_DATA = "127.0.0.1";

// API Keys //
const GOOGLE_API_KEY = '';
const TWITCH_API_KEY = '';
const TWITTER_API_KEY = '';
const FACEBOOK_API_KEY = '';
const INSTAGRAM_API_KEY = '';
const TUMBLR_API_KEY = '';

?>
