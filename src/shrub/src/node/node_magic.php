<?php

// TODO: add limit support
function nodeMagic_GetNodeIdByParentName( $parent, $name ) {
	return db_QueryFetchSingle(
		"SELECT 
			node
		FROM ".SH_TABLE_PREFIX.SH_TABLE_NODE_MAGIC." 
		WHERE 
			parent=? AND name=?
		;",
		$parent,
		$name
	);
}
