
class CJammerCore {
	constructor() {
		this.items = {
			1: {
				name:"*ROOT-NODE*",
				slug:'root',
				type:"root",
				parent:0,
				author:0,
			},
			2: {
				name:"user",
				slug:'u',
				type:"users",
				parent:1,
				author:0,
			},
			3: {
				name:'PoV',
				slug:'pov',
				type:"user",
				parent:2,
				author:0,
				body:"Confirmed Human",
				meta: {
					avatar:'/other/logo/mike/Chicken64.png',
					twitter:'mikekasprzak',
				}
			},

			5: {
				name:"Ludum Dare",
				slug:'ludum-dare',
				type:"event",
				parent:1,
				author:3,
			},

			10:{
				name:"Work in Progress",
				slug:"work-in-progress",
				type:"post",
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
				type:"post",
				parent:5,
				author:3,
				body:"This is message for @PoV. Are you here @PoV? I need @help.\n\n```js\n  var Muffin = 10;\n  Muffin += 2;\n\n  echo \"The Wheel\";```\n\nWhoa.\n\nAlso call @murr-DEATH-weasel."
			}			
		};
		
		this.slugs = {};
		
		this.NODE_NULL = 0;
		this.NODE_ROOT = 1;
		this.NODE_USERS = 2;
		
		// Populate slugs table with keys (parent!slug) //
		for ( item in this.items ) {
			this.slugs[ this.items[item].parent+'!'+this.items[item].slug ] = item;
		}
	}
	
	getItemById( id ) {
		// Convert String to number, in case you forgot //
		if ( typeof id === 'string' ) {
			id = Number(id);
		}
		
		// True test //
		if ( typeof id === 'number' ) {
			if ( id == 0 ) {
				// TODO: Figure out if I should be returning a dummy node named null, or this //
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
		else if ( typeof id === 'array' ) {
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
	
	getItemIdByParentAndSlug( parent, slug ) {
		let key = parent+'!'+slug;
		if ( this.slugs[key] ) {
			return this.slugs[key];
		}

		// Slug not found. We'll have to do work //
		
		return null;
	}
};

// Singleton //
let JammerCore = new CJammerCore();
export default JammerCore;
