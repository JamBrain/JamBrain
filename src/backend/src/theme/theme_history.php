<?php

function themeHistory_Get() {
	return db_QueryFetch(
		"SELECT node, shorthand, name, theme
			FROM ".SH_TABLE_PREFIX.SH_TABLE_THEME_HISTORY.";"
		);
}

// TODO: Function for adding a theme to history
