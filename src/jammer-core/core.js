
class CJammerCore {
	constructor() {
		this.items = {
			1: {
				name:"*ROOT-NODE*",
				slug:'root',
				type:"root",
				subtype:"",
				parent:0,
				author:0,
				body:"",
			},
			2: {
				name:"user",
				slug:'u',
				type:"browse",
				subtype:"user",
				parent:1,
				author:0,
				body:"",
			},
			3: {
				name:'PoV',
				slug:'pov',
				type:"user",
				subtype:"",
				parent:2,
				author:0,
				body:"Confirmed Human",
				meta: {
					avatar:'/other/logo/mike/Chicken64.png',
					twitter:'mikekasprzak',
				}
			},
			4: {
				name:'',
				slug:'mikekasprzak',
				type:"symlink",
				subtype:"",
				parent:2,
				author:0,
				body:"",
				extra:3,		// What we point at //
			},

			5: {
				name:"Ludum Dare",
				slug:'ludum-dare',
				type:"event",
				subtype:"",
				parent:1,
				author:3,
				body:"",
			},
			
			6: {
				name:"Articles",
				slug:'articles',
				type:"browse",
				subtype:"article",
				parent:1,
				author:0,
				body:"",				
			},

			10:{
				name:"Work in Progress",
				slug:"work-in-progress",
				type:"post",
				subtype:"",
				parent:5,
				author:3,
				body:"Hi! Yes the theme is weird and unusual. It's not done.\n\n"+
					"I'm blocking out features, which means I'm focused on adding them and making them work. That doesn't necessarily mean I'm worried about how they look.\n\n"+
					"You're welcome to comment on them, but understand that I'm focused on function, not form."
			},
			11:{
				name:"**True Story:** The Internet is ~~DEAD~~ _REAL_",
				slug:"true-story-the-internet-is-real",
				type:"post",
				subtype:"",
				parent:5,
				author:3,
				body:"Even I can't believe it! I feel like a :whale:! :bird: :crocodile:\n\n"+
					"# This is a quote :tiger: \n\n> Somebody is going to say \"this\", some day\n\n"+
					"This is a quote, from twitter (also a tweet):\n\nhttps://twitter.com/mikekasprzak/status/565641812703203328\n\n"+
					"Some test URLS:\n* https://github.com/ludumdare/ludumdare\n* https://twitter.com/mikekasprzak\n* https://reddit.com/r/ludumdare\n* https://twitch.tv/ludumdare\n* https://www.youtube.com/user/ButtonMasherBros\n* https://www.youtube.com/povrazor\n* http://moo.com\n* Hey @pov, I need @help.\n\n"+
					"This is **BOLD**. This is _ITALICS_. This is ***BOTH***.\n\n"+
					"This is my <b>trying to use HTML</b>, and failing\n\n"+
					"This is a Youtube Video.\n\nhttps://www.youtube.com/watch?v=5vxYUr9e-GY\n\nNice."
			},
			12:{
				name:"A dangerous place in SPAAAACE",
				slug:"a-dangerous-place-in-space",
				type:"article",
				subtype:"",
				parent:6,
				author:3,
				body:"This is message for @PoV. Are you here @PoV? I need @help.\n\n```js\n  var Muffin = 10;\n  Muffin += 2;\n\n  echo \"The Wheel\";```\n\nWhoa.\n\nAlso call @murr-DEATH-weasel."
			}			
		};
		
		this.slugs = {};
		
		this.NODE_NULL = 0;
		this.NODE_ROOT = 1;
		this.NODE_USERS = 2;
		
		// Populate slugs table with keys (parent!slug) //
		this.addItemSlugKeys( this.items );
	}
	
	addItemSlugKeys( items ) {
		for ( item in items ) {
			this.slugs[ this.items[item].parent+'!'+this.items[item].slug ] = item;
		}		
	}
	
	getItemById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' ) {
			id = id.toString();
		}
		
		// True test //
		if ( typeof id === 'string' ) {
			if ( id == '0' ) {
				return null;
			}
			else if ( this.items[id] ) {
				return this.items[id];
			}
			else {
				// Fetch Missing //
				
				// Return Items //
			}
		}
		else if ( Array.isArray(id) ) {
			// Figure out what we don't have //
			let missing = id.filter( item => {
				return !(item in this.items);
			});
			
			// Fetch Missing //
			
			
			// Return Items //
			return id.map( item => {
				return this.items[item] || null;
			});
		}
		
		return null;
	}
	
	getItemTypeById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.items[id] )
			return this.items[id].type;
		return null;
	}
	
	getItemParentById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.items[id] )
			return this.items[id].parent;
		return null;
	}

	getItemSlugById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.items[id] )
			return this.items[id].slug;
		return null;
	}
	
	// Prefetching is an optimization. To make it clearer that you are prefetching, use this function //
	preFetchItemById( id ) {
		this.getItemById( id );
	}
	
	preFetchItemWithAuthorById( id ) {
		this.getItemById( id );
		this.getItemById( this.getAuthorOfItemById(id) );
	}
	
	getItemIdByParentAndSlug( parent, slug ) {
		let key = parent+'!'+slug;
		if ( this.slugs[key] ) {
			return this.slugs[key];
		}

		// Slug not found. We'll have to do work //
		
		return null;
	}
	

	getAuthorOfItemById( id ) {
		let items = this.getItemById( id );
		
		if ( Array.isArray(id) ) {
			// Fetch all authors, removing duplicates //
			let authors = {};

			for ( item in items ) {
				if ( items[item] ) {
					authors[ items[item].author ] = items[item].author;
				}
			}
			
			return Object.keys(authors).map(key => authors[key]);
		}
		else {
			if ( items ) {
				return items.author;
			}
		}
		
		return null;
	}


	// Walk the tree starting at the parent, decoding slugs, returing the ID of the last one //
	getItemIdByParentAndSlugs( parent, slugs ) {
		if ( !parent )
			return null;
		
		// Check if special //
		var parent_data = this.getItemById(parent);
		if ( parent_data.type === 'symlink' ) {
			parent = parent_data.extra;
		}
		
		if ( (slugs.length == 1) && (slugs[0] === "") ) {
			// Cleverness: only the root should ever have a blank slug //
			return parent;
		}
		else if ( slugs.length > 0 ) {
			// Cleverness: slugs gets shifted before the main function is called.
			return this.getItemIdByParentAndSlugs( this.getItemIdByParentAndSlug(parent, slugs.shift()), slugs );
		}

		// And done //
		return parent;
	}

	// Walk the tree starting at the parent, decoding slugs, and return all ids //
	getItemPathByParentAndSlugs( parent, slugs, ids ) {
		if ( !parent )
			return null;

		// Check if parent is special //
		var parent_data = this.getItemById(parent);
		if ( parent_data.type === 'symlink' ) {
			parent = parent_data.extra;
		}

		// Build List //
		if ( !Array.isArray(ids) )
			ids = [ parent.toString() ];
		else
			ids.push( parent );
			
		if ( (slugs.length == 1) && (slugs[0] === "") ) {
			// Cleverness: only the root node should ever have a blank slug //
			return parent;
		}
		else if ( slugs.length > 0 ) {
			// Cleverness: slugs gets shifted before the main function is called.
			return this.getItemPathByParentAndSlugs( this.getItemIdByParentAndSlug(parent, slugs.shift()), slugs, ids );
		}
		
		return ids;

//		else if ( slugs[0] === "" ) {
//			return ids;
//		}
//		else {
//			ids.push( this.getItemIdByParentAndSlug(parent, slugs[0]) );
//			return ids;
//		}
	}

	// Given an id, walk the tree backwards, return all ids in its TRUE PATH. //
	getItemPathById( id, ids ) {
		if ( !id )
			return ids;
			
		if ( !Array.isArray(ids) )
			ids = [ id.toString() ];
		else
			ids.unshift( id.toString() );
		
		return this.getItemPathById( this.getItemParentById(id), ids );
	}

	// Given an id, walk the tree backwards, return all slugs in its TRUE PATH. //
	getItemPathSlugsById( id, ids ) {
		if ( !id )
			return ids;
			
		if ( !Array.isArray(ids) )
			ids = [ this.getItemSlugById(id) ];
		else
			ids.unshift( this.getItemSlugById(id) );
		
		return this.getItemPathSlugsById( this.getItemParentById(id), ids );
	}

};

// Singleton //
let JammerCore = new CJammerCore();
export default JammerCore;
