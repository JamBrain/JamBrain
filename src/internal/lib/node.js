;(function(){
	
/**
	Node Library - get information about nodes
	
	NOTE: these functions will be globally available. No need to include anything. Also you can't use ES6 here.
	
	Try to mirror what's available in "src/shrub/src/node/node_util.php"
*/

window.node_IsPublished = function( node ) {
	return node.published;
}

window.node_IsAuthor = function( node, user ) {
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
	// Refs checks are first, because it's an early rejection
	if ( node.id && user.private && user.private.refs && user.private.refs.star && user.private.link && user.private.link.star ) {
		return (user.private.refs.star.indexOf(node.id) !== -1) && (user.private.link.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_IsFollowing = function( user, node ) {
	if ( node.id && user.private && user.private.link && user.private.link.star ) {
		return (user.private.link.star.indexOf(node.id) !== -1);
	}
	return false;
}

window.nodeUser_GetFriends = function( user ) {
	if ( user.private && user.private.refs && user.private.refs.star && user.private.link && user.private.link.star ) {
		return intersection(user.private.link.star, user.private.refs.star);
	}
	return [];
}

window.node_CanCreate = function( node ) {
	return node.meta && node.meta['can-create'];
}
window.node_CanTheme = function( node ) {
	return node.meta && node.meta['can-theme'];
}

//window.nodeUser_IsTeamLeader = function( user, project ) {
//	
//}

})();
