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
	if ( node.link && node.link.author && node.link.author.indexOf(user.id) != -1 )
		return true;
	
	return false;
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
	if ( node.id && user.private && user.private.refs && user.private.refs.star && user.private.link && user.private.link.star ) {
		return (user.private.refs.star.indexOf(node.id) !== -1) && (user.private.link.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_IsFollowing = function( user, node ) {
	// Return null if either arguments are invalid
	if ( !user || !node )
		return null;

	if ( node.id && user.private && user.private.link && user.private.link.star ) {
		return (user.private.link.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_GetFriends = function( user ) {
	// Return null if argument is invalid
	if ( !user )
		return null;

	if ( user.private && user.private.refs && user.private.refs.star && user.private.link && user.private.link.star ) {
		return intersection(user.private.link.star, user.private.refs.star);
	}
	return [];
}

window.node_CanCreate = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && node.meta['can-create'];
};
window.node_CanTheme = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && node.meta['can-theme'];
};
window.node_CanGrade = function( node ) {
	// Return null if argument is invalid
	if ( !node )
		return null;

	return node.meta && node.meta['can-grade'];
};

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
