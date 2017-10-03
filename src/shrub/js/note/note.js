import Fetch	 				from '../internal/fetch';

export default {
	Get,
	Pick,
	Add,
	Update
};


export function Get( node ) {
	return Fetch.Get(API_ENDPOINT+'/vx/note/get/'+node, true);
}

export function Pick( nodeNoteMap ) {
	let Promises = [];
	let response = {
		status: null,
		caller_id: null,
		note: new Map(),
	};
	
	nodeNoteMap.forEach((notes, node) => {
		Promises.push(Get(node).then((r) => {
			if (r.note) {
				let filterNotes = nodeNoteMap.get(node);
				r.note.forEach((note) => {
					if (filterNotes.indexOf(note.id) > -1) {
						if (response.note.has(node)) {
							response.note.get(node).push(note);
						} else {
							response.note.set(node, [note]);
						}
					}
				});				
			}
			if (r.status != 200 || response.status === null) {
				response.status = r.status;
			}
			if (response.caller_id == null && r.caller_id !== undefined && r.caller_id !== null) {
				response.caller_id = r.caller_id;
			}
		}));
	});
	return Promise.all(Promises).then(() => {
		return Promise.resolve(response);
	});
}

export function Add( parent, node, body, tag ) {
	var Data = {};
	
	if ( Number.isInteger(parent) )
		Data.parent = parent;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/add/'+node, Data);
}

export function Update( id, node, body, tag ) {
	var Data = {};
	
	if ( node )
		Data.node = node;
	if ( body )
		Data.body = body;
	if ( tag )
		Data.tag = tag;
	
	return Fetch.Post(API_ENDPOINT+'/vx/note/update/'+id, Data);
}
