<?php

// General Config Information //
const CMW_USING_DB = true;
const CMW_USING_MYSQL = true;			// True if MySQL, PerconaDB, and MariaDB
//const CMW_USING_MARIADB = true;
const CMW_USING_APCU = true;
//const CMW_USING_MEMCACHED = true;
//const CMW_USING_REDIS = true;
const CMW_USING_MAGICK = true;
const CMW_USING_IMAGEMAGICK = true;
//const CMW_USING_GRAPHICSMAGICK = true;
const CMW_USING_PNGQUANT = true;
const CMW_USING_FFMPEG = true;
//const CMW_USING_GIFSICLE = true;

// Database Config //
const CMW_DB_HOST = 'localhost';
const CMW_DB_NAME = 'database';
const CMW_DB_LOGIN = 'login';
const CMW_DB_PASSWORD = 'password';
//const CMW_DB_PORT = 3306;

const CMW_TABLE_PREFIX = 'cmw_';

// Memcached Config //
const CMW_MEMCACHED_HOST = 'localhost';
const CMW_MEMCACHED_PORT = 11211;

// Redis Config //
const CMW_REDIS_HOST = 'localhost';

// Debug Flags //
const CMW_PHP_DEBUG = true;			// PHP Debug Mode: Extra logging, query debug features.
const CMW_CSS_DEBUG = true;			// CSS Debug Mode: Not minified, src includes.
const CMW_JS_DEBUG = true;			// JavaScript Debug Mode: Not minified, src includes.

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
