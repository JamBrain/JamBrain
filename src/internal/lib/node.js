/**
	Node Library - get information about nodes

	NOTE: these functions will be globally available. No need to include anything. Also you can't use ES6 here.

	Try to mirror what's available in "src/backend/src/node/node_util.php"
*/

/**
 * @typedef {Object} Node
 * @property {number} id
 * @property {string} type
 * @property {string} subtype
 * @property {string} subsubtype
 * @property {number} author
 * @property {number} parent
 * @property {number} published //dates
 * @property {number} created
 * @property {number} modified
 * @property {Object} [meta]
 * @property {Object} [private]
 * @property {Object} [files]
 */


/**
 *
 * @param {Node} node
 * @returns {number|null}
 */
export function node_IsPublished( node ) {
	// Return null if arguments are invalid
	if ( !node )
		return null;

	return node.published;
}

/**
 *
 * @param {Node} node
 * @param {Node|Object} user // NOTE: you might want to make this Node only, but some "cleverness" code makes a dummy object with just an id
 * @returns {boolean|null}
 */
export function node_IsAuthor( node, user ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	// Confirm non-zero
	if ( !user.id )
		return false;

	// Check if you are the node's author
	if ( node.author == user.id )
		return true;

	// Check if you are on the list of authors (metadata)
	if ( node.meta && node.meta.author && (node.meta.author.indexOf(user.id) != -1) )
		return true;

	return false;
}

/**
 *
 * @param {Node} node
 * @returns {number}
 */
export function node_CountAuthors( node ) {
	if ( !node.meta || !node.meta['author'] )
		return node.author ? 1 : 0;
	return node.meta['author'].length;
}


// http://stackoverflow.com/a/16227294/5678759
function intersection(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

/**
 *
 * @param {Node} user
 * @param {Node} node
 * @returns {boolean|null}
 */
export function nodeUser_IsFriend( user, node ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	// Refs checks are first, because it's an early rejection
	if ( node.id && user.private && user.private.refs && user.private.refs.star && user.private.meta && user.private.meta.star ) {
		return (user.private.refs.star.indexOf(node.id) !== -1) && (user.private.meta.star.indexOf(node.id) !== -1);
	}
	return false;
}

/**
 *
 * @param {Node} user
 * @param {Node} node
 * @returns {boolean|null}
 */
export function nodeUser_IsFollowings( user, node ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	if ( node.id && user.private && user.private.meta && user.private.meta.star ) {
		return (user.private.meta.star.indexOf(node.id) !== -1);
	}
	return false;
}

/**
 *
 * @param {Node} user
 * @returns {number[]|null}
 */
export function nodeUser_GetFriends( user ) {
	// Return null if argument is invalid
	if ( !user )
		return null;

	if ( user.private && user.private.refs && user.private.refs.star && user.private.meta && user.private.meta.star ) {
		return intersection(user.private.meta.star, user.private.refs.star);
	}
	return [];
}

// Is creating allowed on this node? Optionally specify the fulltype
/**
 *
 * @param {Node} node
 * @param {string|null} [fulltype]
 * @returns {boolean|null}
 */
export function node_CanCreate( node, fulltype = null ) {
	// Return null if argument is invalid
	if ( !node || !node.meta ) {
		return null;
	}

	// If omitted or not a string, then the answer is no
	if ( !node.meta['can-create'] || (typeof node.meta['can-create'] != 'string') ) {
		return false;
	}

	// If length is 1, it's a legacy value (i.e. 0 or 1)
	if ( node.meta['can-create'].length == 1 ) {
		return Number(node.meta['can-create']) == 1;
	}
	// Otherwise it's a v2 value. If no fulltype is specified, the answer is either no (false) or maybe (true).
	else if ( fulltype === null ) {
		return (node.meta['can-create'].length > 0);
	}

	// Get the keys
	var keys = node.meta['can-create'].split('+');

	// the answer is yes (true) if fulltype is one of the keys
	return (keys.indexOf(fulltype) >= 0);
}

// Is transforming (type changing) allowed on this node? Optionally specify the fulltype
/**
 *
 * @param {Node} node
 * @param {string|null} [fulltype]
 * @returns {boolean|null}
 */
export function node_CanTransform( node, fulltype = null ) {
	// Return null if argument is invalid
	if ( !node || !node.meta ) {
		return null;
	}

	// If omitted, then the answer is no
	if ( !node.meta['can-transform'] ) {
		return false;
	}

	// If no fulltype is specified, the answer is either no (false) or maybe (true).
	if ( fulltype === null ) {
		return (node.meta['can-transform'].length > 0);
	}

	// Get the keys
	var keys = node.meta['can-transform'].split('+');

	// the answer is yes (true) if fulltype is one of the keys
	return (keys.indexOf(fulltype) >= 0);
}

/**
 *
 * @param {Node} node
 * @returns {boolean|null}
 */
export function nodeEvent_CanTheme( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && (Number(node.meta['can-theme']) > 0);
}
/**
 *
 * @param {Node} node
 * @returns {boolean}
 */
export function nodeEvent_CanGrade( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && (Number(node.meta['can-grade']) > 0);
}
// TODO: Obsolete the 'event-finished' metadata
/**
 *
 * @param {Node} node
 * @returns {boolean|null}
 */
export function nodeEvent_IsFinished( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && (Number(node.meta['event-finished']) > 0);
}
// NOTE: this expects you to call it with the parent. A better function
// should be able to lookup the parent itself given the node.
/**
 *
 * @param {Node} node
 * @returns {boolean|null}
 */
export function node_CanUpload( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && (Number(node.meta['can-upload']) > 0);
}

// Is publishing allowed on this node? Optionally specify the fulltype
/**
 *
 * @param {Node} node
 * @param {string} [fulltype]
 * @returns {boolean|null}
 */
export function node_CanPublish( node, fulltype = null ) {
	// Return null if argument is invalid
	if ( !node || !node.meta ) {
		return null;
	}

	// If omitted, then the answer is no
	if ( !node.meta['can-publish]'] ) {
		return false;
	}

	// If length is 1, it's a legacy value (i.e. 0 or 1)
	if ( node.meta['can-publish'].length == 1 ) {
		return Number(node.meta['can-publish']) == 1;
	}
	// Otherwise it's a v2 value. If no fulltype is specified, the answer is either no (false) or maybe (true).
	else if ( fulltype === null ) {
		return (node.meta['can-publish'].length > 0);
	}

	// Get the keys
	var keys = node.meta['can-publish'].split('+');

	// the answer is yes (true) if fulltype is one of the keys
	return (keys.indexOf(fulltype) >= 0);
}

/**
 *
 * @param {Node} node
 * @returns {string|null}
 */
export function node_GetFullType( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	// Construct fulltype
	var fulltype = node.type;
	if (node.subtype)
		fulltype += '/' + node.subtype;
	if (node.subsubtype)
		fulltype += '/' + node.subsubtype;

	// return fulltype
	return fulltype;
}

/**
 *
 * @param {Node} node
 * @returns {boolean|null}
 */
export function node_HasEmbed( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	// Return null if node has no files
	if ( !node.files )
		return null;

	// Iterate over all files, and return true if we find the embedded file
	for ( var idx = 0; idx < node.files.length; idx++ ) {
		if ( (node.files[idx].name.indexOf("$$embed") !== -1) && (node.files[idx].status & 0x8) ) {
			return true;
		}
	}

	return false;
}

/**
 *
 * @param {Node} node
 * @returns {Object|null}
 */
export function node_GetEmbed( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	// Return null if node has no files
	if ( !node.files )
		return null;

	let file = null;

	// Iterate over all files, and return true if we find the embedded file
	for ( var idx = 0; idx < node.files.length; idx++ ) {
		if ( (node.files[idx].name.indexOf("$$embed") !== -1) && (node.files[idx].status & 0x8) ) {
			if ( !file || (node.files[idx].id > file.id) ) {
				file = node.files[idx];
			}
		}
	}

	return file;
}

/**
 *
 * @param {Node} node
 * @returns {string[]}
 */
export function nodeItem_GetPlatforms( node ) {
	if ( node && node.meta && node.meta.platform ) {
		return node.meta.platform;
	}
	return [];
}
/**
 *
 * @param {Node} node
 * @returns {string[]}
 */
export function nodeItem_GetTags( node ) {
	if ( node && node.meta && node.meta.tag ) {
		return node.meta.tag;
	}
	return [];
}


/**
 *
 * @param {Node[]} nodes
 * @param {number} parent_id
 * @returns {boolean|null}
 */
export function nodes_HasParent( nodes, parent_id ) {
	// Return null if argument is invalid
	if ( !nodes )
		return null;

	// TODO: Confirm nodes is an array

	for ( let idx = 0; idx < nodes.length; idx++ ) {
		if ( nodes[idx].parent == parent_id )
			return true;
	}
	return false;
}

/**
 *
 * @param {Node[]} nodes
 * @param {number} parent_id
 * @returns {boolean|null}
 */
export function nodeKeys_HasParent( nodes, parent_id ) {
	// Return null if argument is invalid
	if ( !nodes )
		return null;

	// TODO: Confirm nodes is an array

	//for ( idx = 0; idx < nodes.length; idx++ ) {
	for ( var key in nodes ) {
		if ( nodes[key].parent == parent_id )
			return true;
	}
	return false;
}

/**
 *
 * @param {Node[]} nodes
 * @param {number} parent_id
 * @returns {boolean|null}
 */
export function nodeKeys_HasPublishedParent( nodes, parent_id ) {
	// Return null if argument is invalid
	if ( !nodes )
		return null;

	// TODO: Confirm nodes is an array

	//for ( idx = 0; idx < nodes.length; idx++ ) {
	for ( var key in nodes ) {
		if ( nodes[key].parent == parent_id && nodes[key].published )
			return true;
	}
	return false;
}


export default {
	node_IsPublished,
	node_IsAuthor,
	node_CountAuthors,
	nodeUser_IsFriend,
	nodeUser_IsFollowings,
	nodeUser_GetFriends,
	node_CanCreate,
	node_CanTransform,
	nodeEvent_CanTheme,
	nodeEvent_CanGrade,
	nodeEvent_IsFinished,
	node_CanUpload,
	node_CanPublish,
	node_GetFullType,
	node_HasEmbed,
	node_GetEmbed,
	nodeItem_GetPlatforms,
	nodeItem_GetTags,
	nodes_HasParent,
	nodeKeys_HasParent,
	nodeKeys_HasPublishedParent,
};
