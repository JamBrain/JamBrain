
class CCoreData {
	constructor() {
		this.nodes = {
			1: {
				name:"",
				slug:'roots',
				type:"roots",
				subtype:"",
				parent:0,
				author:0,
				body:"",
			},
			2: {
				name:"Users",
				slug:'u',
				type:"users",
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
				name:"**Alpha Testing**: Week 1",
				slug:"alpha-testing-week-1",
				type:"post",
				subtype:"",
				parent:5,
				author:3,
				body:"Hi everybody! Welcome to the new site!\n\n"+
					"Over the next few weeks, we'll be gradually rolling out **core** features of this website. "+
					"It's going to be a little bumpy. Many things you're expecting wont be available right away (Posting, Commenting, Notifications, Mobile, ... well really, most features are either unfinished or disabled). Have patience! We'll get there.\n\n"+
					"This week we're starting with just two things:\n\n"+
					"* Creating Accounts\n"+
					"* Suggesting Themes\n"+
					"\n"+
					"You can begin the process by clicking the **Create Account** button above.\n\n"+
					"**Everyone** is making a new user account! Create **personal** accounts, **don't create team accounts**!\n\n"+
					"We'll be revisiting how to create teams in the coming weeks.\n\n"+
					"Usernames are **very** important on this new site. Since it would be terrible if previous participants had their name stolen, **we've reserved usernames** belonging to anyone that has previously participated in a Ludum Dare event. Simply use the original e-mail address you signed with on ludumdare.com, and it will let you activate that name.\n\n"+
					"Don't have access to your old e-mail account? That's okay! Create a temporary account with an e-mail you _do_ have access to. Next year, when we start migrating the data over, we'll have a process for recovering old names and accounts.\n\n"+
					"You may notice that account names are _more strict_ than they were before. Names must be alphanumeric, and may separate words with a dot, dash, or underscore, but can't start or end with one. Internally, names are lower case with dashes. Your new **\"Jammer Account\"** is shared across **Ludum Dare** and other services we'll be launching next year. It's all about jamming, so it made sense to call these new shared accounts **Jammer** accounts.\n\n"+
					"If you're having problems activating, be sure to whitelist `hello@jammer.vg` in your spam filter.\n\n"+
					"Once you've created your account, you can **go here** to begin making suggestions:\n\n"+
					"* https://ldjam.com/blah\n\n"+
					"And that's it!\n\n"+
					"Follow the main Twitter account at https://twitter.com/ludumdare for event announcements. For alpha testing announcements, follow my personal Twitter account at https://twitter.com/mikekasprzak.\n\n"+
					"We'll be back soon with more rounds of **Theme Selection**, and to start making **Teams**."
			},

			11:{
				name:"**Live Streaming**: The New Way",
				slug:"live-streaming-the-new-way",
				type:"post",
				subtype:"",
				parent:5,
				author:3,
				body:"Hey streamers!\n\n"+
					"I've been chatting with the team at **Twitch**, and they've asked me to ask you _veeeeery nicely_ to move our **Ludum Dare** Twitch streams over to **https://twitch.tv/Creative**.\n\n"+
					"How do you do that?\n\n"+
					"Set your game to **Creative** on Twitch, and include the hashtag **#LDJAM** in your title. Easy.\n\n"+
					"In addition, you can include other hashtags to help categorize your stream in the **Twitch Creative** directory. Some examples:\n\n"+
					"* **#gamedev**, **#programming**, #unity, #unreal, #gamemaker, ...\n"+
					"* **#gameart**, **#pixelart**, **#animation**, #illustration, ...\n"+
					"* **#gameaudio**, **#music**, #voiceacting, ...\n"+
					"\n"+
					"And others. Check out the **https://twitch.tv/Creative** directory for suggestions.\n\n"+
					"We _also_ track the hashtags, and do our own categorizing. In our case, we're grouping different hashtags together as tasks. So if you can be specific about what you're up to (**development**, **art**, **audio**), we can better categorize your stream in our system. We'll be doing more with this in the future.\n\n"+
					"Our internal hashtag tracking is also supported on other streaming services, but at the moment we're only following **Twitch** and **Hitbox** streams.\n\n"+
					"On **Hitbox**, set your game to **Ludum Dare**. Include hashtags to let us know _what_ you're doing.\n\n"+
					"Support for other streaming services (**YouTube**, **Beam**) will return for future events."
			},

			12:{
				name:"Hello World",
				slug:"hello-world",
				type:"post",
				subtype:"",
				parent:5,
				author:3,
				body:"Well, the first post always has to be \"Hello World\", right? It's the law. :smile:"
			},
//			11:{
//				name:"**True Story:** The Internet is ~~DEAD~~ _REAL_",
//				slug:"true-story-the-internet-is-real",
//				type:"post",
//				subtype:"",
//				parent:5,
//				author:3,
//				body:"Even I can't believe it! I feel like a :whale:! :bird: :crocodile:\n\n"+
//					"# This is a quote :tiger: \n\n> Somebody is going to say \"this\", some day\n\n"+
//					"This is a quote, from twitter (also a tweet):\n\nhttps://twitter.com/mikekasprzak/status/565641812703203328\n\n"+
//					"Some test URLS:\n* https://github.com/ludumdare/ludumdare\n* https://twitter.com/mikekasprzak\n* https://reddit.com/r/ludumdare\n* https://twitch.tv/ludumdare\n* https://www.youtube.com/user/ButtonMasherBros\n* https://www.youtube.com/povrazor\n* http://moo.com\n* Hey @pov, I need @help.\n\n"+
//					"This is **BOLD**. This is _ITALICS_. This is ***BOTH***.\n\n"+
//					"This is my <b>trying to use HTML</b>, and failing\n\n"+
//					"This is a Youtube Video.\n\nhttps://www.youtube.com/watch?v=5vxYUr9e-GY\n\nNice."
//			},
//			12:{
//				name:"A dangerous place in SPAAAACE",
//				slug:"a-dangerous-place-in-space",
//				type:"post",
//				subtype:"",
//				parent:6,
//				author:3,
//				body:"This is message for @PoV. Are you here @PoV? I need @help.\n\n```js\n  var Muffin = 10;\n  Muffin += 2;\n\n  echo \"The Wheel\";```\n\nWhoa.\n\nAlso call @murr-DEATH-weasel."
//			}			
		};

		this.slugs = {};

		this.NODE_NULL = 0;
		this.NODE_ROOT = 1;
		this.NODE_USERS = 2;

		// Populate slugs table with keys (parent!slug) //
		this.addNodeSlugKeys( this.nodes );
	}

	addNodeSlugKeys( nodes ) {
		for ( node in nodes ) {
			this.slugs[ this.nodes[node].parent+'!'+this.nodes[node].slug ] = node;
		}
	}

	getNodeById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' ) {
			id = id.toString();
		}

		// True test //
		if ( typeof id === 'string' ) {
			if ( id == '0' ) {
				return null;
			}
			else if ( this.nodes[id] ) {
				return this.nodes[id];
			}
			else {
				// Fetch Missing //

				// Return Nodes //
			}
		}
		else if ( Array.isArray(id) ) {
			// Figure out what we don't have //
			let missing = id.filter( node => {
				return !(node in this.nodes);
			});

			// Fetch Missing //


			// Return Nodes //
			return id.map( node => {
				return this.nodes[node] || null;
			});
		}

		return null;
	}

	getNodeTypeById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.nodes[id] )
			return this.nodes[id].type;
		return null;
	}

	getNodeParentById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.nodes[id] )
			return this.nodes[id].parent;
		return null;
	}

	getNodeNameById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.nodes[id] )
			return this.nodes[id].name;
		return null;
	}

	getNodeSlugById( id ) {
		// Convert Number to a String. Counter intuative yes, but this saves an extra cast //
		if ( typeof id === 'number' )
			id = id.toString();

		if ( this.nodes[id] )
			return this.nodes[id].slug;
		return null;
	}

	// Prefetching is an optimization. To make it clearer that you are prefetching, use this function //
	preFetchNodeById( id ) {
		this.getNodeById( id );
	}

	preFetchNodeWithAuthorById( id ) {
		this.getNodeById( id );
		this.getNodeById( this.getAuthorOfNodeById(id) );
	}

	getNodeIdByParentAndSlug( parent, slug ) {
		let key = parent+'!'+slug;
		if ( this.slugs[key] ) {
			return this.slugs[key];
		}

		// Slug not found. We'll have to do work //

		return null;
	}


	getAuthorOfNodeById( id ) {
		let nodes = this.getNodeById( id );

		if ( Array.isArray(id) ) {
			// Fetch all authors, removing duplicates //
			let authors = {};

			for ( node in nodes ) {
				if ( nodes[node] ) {
					authors[ nodes[node].author ] = nodes[node].author;
				}
			}

			return Object.keys(authors).map(key => authors[key]);
		}
		else {
			if ( nodes ) {
				return nodes.author;
			}
		}

		return null;
	}


	// Walk the tree starting at the parent, decoding slugs, returing the ID of the last one //
	getNodeIdByParentAndSlugs( parent, slugs ) {
		if ( !parent )
			return null;

		// Check if special //
		var parent_data = this.getNodeById(parent);
		if ( parent_data.type === 'symlink' ) {
			parent = parent_data.extra;
		}

		if ( (slugs.length == 1) && (slugs[0] === "") ) {
			// Cleverness: only the root should ever have a blank slug //
			return parent;
		}
		else if ( slugs.length > 0 ) {
			// Cleverness: slugs gets shifted before the main function is called.
			return this.getNodeIdByParentAndSlugs( this.getNodeIdByParentAndSlug(parent, slugs.shift()), slugs );
		}

		// And done //
		return parent;
	}

	// Walk the tree starting at the parent, decoding slugs, and return all ids //
	getNodePathByParentAndSlugs( parent, slugs, ids ) {
		if ( !parent )
			return null;

		// Check if parent is special //
		var parent_data = this.getNodeById(parent);
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
			return this.getNodePathByParentAndSlugs( this.getNodeIdByParentAndSlug(parent, slugs.shift()), slugs, ids );
		}

		return ids;

//		else if ( slugs[0] === "" ) {
//			return ids;
//		}
//		else {
//			ids.push( this.getNodeIdByParentAndSlug(parent, slugs[0]) );
//			return ids;
//		}
	}

	// Given an id, walk the tree backwards, return all ids in its TRUE PATH. //
	getNodePathById( id, ids ) {
		if ( !id )
			return ids;

		if ( !Array.isArray(ids) )
			ids = [ id.toString() ];
		else
			ids.unshift( id.toString() );

		return this.getNodePathById( this.getNodeParentById(id), ids );
	}

	// Given an id, walk the tree backwards, return all slugs in its TRUE PATH. //
	getNodePathSlugsById( id, ids ) {
		if ( !id )
			return ids;

		if ( !Array.isArray(ids) )
			ids = [ this.getNodeSlugById(id) ];
		else
			ids.unshift( this.getNodeSlugById(id) );

		return this.getNodePathSlugsById( this.getNodeParentById(id), ids );
	}

};

// Singleton //
let CoreData = new CCoreData();
export default CoreData;
