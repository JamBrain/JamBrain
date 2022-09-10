;(function(){

/**
	Node Library - get information about nodes

	NOTE: these functions will be globally available. No need to include anything. Also you can't use ES6 here.

	Try to mirror what's available in "src/shrub/src/node/node_util.php"
*/

window.node_IsPublished = function( node ) {
	// Return null if arguments are invalid
	if ( !node )
		return null;

	return node.published;
}

window.node_IsAuthor = function( node, user ) {
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


window.node_CountAuthors = function( node ) {
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

window.nodeUser_IsFriend = function( user, node ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	// Refs checks are first, because it's an early rejection
	if ( node.id && user.private && user.private.refs && user.private.refs.star && user.private.meta && user.private.meta.star ) {
		return (user.private.refs.star.indexOf(node.id) !== -1) && (user.private.meta.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_IsFollowing = function( user, node ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	if ( node.id && user.private && user.private.meta && user.private.meta.star ) {
		return (user.private.meta.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_GetFriends = function( user ) {
	// Return null if argument is invalid
	if ( !user )
		return null;

	if ( user.private && user.private.refs && user.private.refs.star && user.private.meta && user.private.meta.star ) {
		return intersection(user.private.meta.star, user.private.refs.star);
	}
	return [];
}

// Is creating allowed on this node? Optionally specify the fulltype
window.node_CanCreate = function( node, fulltype = null ) {
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
		return parseInt(node.meta['can-create']) == 1;
	}
	// Otherwise it's a v2 value. If no fulltype is specified, the answer is either no (false) or maybe (true).
	else if ( fulltype === null ) {
		return (node.meta['can-create'].length > 0);
	}

	// Get the keys
	var keys = node.meta['can-create'].split('+');

	// the answer is yes (true) if fulltype is one of the keys
	return (keys.indexOf(fulltype) >= 0);
};

// Is transforming (type changing) allowed on this node? Optionally specify the fulltype
window.node_CanTransform = function( node, fulltype ) {
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
};

window.nodeEvent_CanTheme = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && parseInt(node.meta['can-theme']);
};
window.nodeEvent_CanGrade = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && parseInt(node.meta['can-grade']);
};
// TODO: Obsolete the 'event-finished' metadata
window.nodeEvent_IsFinished = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && parseInt(node.meta['event-finished']);
};
// NOTE: this expects you to call it with the parent. A better function
// should be able to lookup the parent itself given the node.
window.node_CanUpload = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && parseInt(node.meta['can-upload']);
};

// Is publishing allowed on this node? Optionally specify the fulltype
window.node_CanPublish = function( node, fulltype ) {
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
		return parseInt(node.meta['can-publish']) == 1;
	}
	// Otherwise it's a v2 value. If no fulltype is specified, the answer is either no (false) or maybe (true).
	else if ( fulltype === null ) {
		return (node.meta['can-publish'].length > 0);
	}

	// Get the keys
	var keys = node.meta['can-publish'].split('+');

	// the answer is yes (true) if fulltype is one of the keys
	return (keys.indexOf(fulltype) >= 0);
};

window.node_GetFullType = function( node ) {
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

window.node_HasEmbed = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	// Return null if node has no files
	if ( !node.files )
		return null;

	// Iterate over all files, and return true if we find the embedded file
	for ( var idx = 0; idx < node.files.length; idx++ ) {
		if ( node.files[idx].name == "$$embed.zip" ) {
			return true;
		}
	}
	
	return false;
}

window.node_GetEmbed = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	// Return null if node has no files
	if ( !node.files )
		return null;

	let file = null;

	// Iterate over all files, and return true if we find the embedded file
	for ( var idx = 0; idx < node.files.length; idx++ ) {
		if ( node.files[idx].name == "$$embed.zip" ) {
			if ( !file || (node.files[idx].id > file.id) ) {
				file = node.files[idx];
			}
		}
	}
	
	return file;
}

window.nodeItem_GetPlatforms = function( node ) {
	if ( node && node.meta && node.meta.platform ) {
		return node.meta.platform;
	}
	return [];
}
window.nodeItem_GetTags = function( node ) {
	if ( node && node.meta && node.meta.tag ) {
		return node.meta.tag;
	}
	return [];
}


//window.nodeUser_IsTeamLeader = function( user, project ) {
//
//}

window.nodes_HasParent = function( nodes, parent_id ) {
	// Return null if argument is invalid
	if ( !nodes )
		return null;

	// TODO: Confirm nodes is an array

	for ( idx = 0; idx < nodes.length; idx++ ) {
		if ( nodes[idx].parent == parent_id )
			return true;
	}
	return false;
};

window.nodeKeys_HasParent = function( nodes, parent_id ) {
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
};

window.nodeKeys_HasPublishedParent = function( nodes, parent_id ) {
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
};

})();
