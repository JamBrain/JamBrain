<?php

// General Config Information //
const CMW_USING_DB = true;
const CMW_USING_APCU = true;
//const CMW_USING_MEMCACHED = true;
//const CMW_USING_REDIS = true;

// Database Config //
const CMW_DB_HOST = 'localhost';
const CMW_DB_NAME = 'database';
const CMW_DB_LOGIN = 'login';
const CMW_DB_PASSWORD = 'password';
const CMW_TABLE_PREFIX = 'cmw_';
//const CMW_USES_PDO = true;		// Default Database is MySQL. Enable this to use PDO.

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

// Access Permission Whitelist //
const CMW_ACCESS_DATA = "127.0.0.1";

// API Keys //
const GOOGLE_API_KEY = '';

?>
