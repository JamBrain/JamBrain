<?php
// General Shrub Configuration //
const SH_USING_DB = true;
const SH_USING_MYSQL = true;				// True if MySQL, MariaDB, PerconaDB, etc.
const SH_USING_MARIADB = true;
const SH_USING_APCU = true;
//const SH_USING_MEMCACHED = true;
//const SH_USING_REDIS = true;

// Graphics Configuration //
const SH_USING_MAGICK = true;
const SH_USING_IMAGEMAGICK = true;
//const SH_USING_GRAPHICSMAGICK = true;
const SH_USING_PNGQUANT = true;
const SH_USING_FFMPEG = true;
const SH_USING_GIFSICLE = true;

// Database Config //
const SH_DB_HOST = 'localhost';
const SH_DB_NAME = 'scotchbox';
const SH_DB_LOGIN = 'root';
const SH_DB_PASSWORD = 'root';
//const SH_DB_PORT = 3306;

const SH_TABLE_PREFIX = 'sh_';

const SH_SEARCHDB_HOST = '127.0.0.1';
const SH_SEARCHDB_NAME = '';
const SH_SEARCHDB_LOGIN = '';
const SH_SEARCHDB_PASSWORD = '';
const SH_SEARCHDB_PORT = 9306;

// Memcached Config //
//const SH_MEMCACHED_HOST = 'localhost';
//const SH_MEMCACHED_PORT = 11211;

// Redis Config //
//const SH_REDIS_HOST = 'localhost';

// Debug Flags //
//const SH_PHP_DEBUG = true;			// PHP Debug Mode: Extra logging, query debug features.
//const SH_CSS_DEBUG = true;			// CSS Debug Mode: Not minified, src includes.
//const SH_JS_DEBUG = true;			// JavaScript Debug Mode: Not minified, src includes.

// Paths //
//const API_DOMAIN = 'api.use.default';
//const SH_STATIC_DIR = '/public-static';
//if ( isset($_SERVER['SERVER_ADDR']) ) define("SH_STATIC_URL",'//'.$_SERVER['SERVER_ADDR'].':8080');

// Access Permission Whitelist (Can be arrays on PHP 5.6+) //
//const SH_ACCESS_DATA = "192.168.48.1";

//const SECURE_LOGIN_ONLY = true;

// API Keys //
const GOOGLE_API_KEY = '';
const TWITCH_API_KEY = '';
const TWITTER_API_KEY = '';
const FACEBOOK_API_KEY = '';
const INSTAGRAM_API_KEY = '';
const TUMBLR_API_KEY = '';
