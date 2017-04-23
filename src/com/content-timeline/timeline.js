import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentMore						from 'com/content-more/more';
import ContentCommon					from 'com/content-common/common';

import $Node							from '../../shrub/js/node/node';

export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			feed: [],
			hash: {},
			offset: 5, //10
			added: null,
            loaded : false
		};

		this.makeFeedItem = this.makeFeedItem.bind(this);
		this.fetchMore = this.fetchMore.bind(this);

	}

	componentDidMount() {
		var props = this.props;

		this.getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['post'],
			props.subtypes ? props.subtypes : null,
			props.subsubtypes ? props.subsubtypes : null,
			null,
			this.props.limit
		);
	}

	appendFeed( newfeed ) {

		var feed = this.state.feed;

		var hash = this.state.hash;

		for ( var idx = 0; idx < newfeed.length; idx++ ) {
			var info = newfeed[idx];
			if ( !hash[info['id']] ) {
				hash[info['id']] = feed.length;
				feed.push(info);
			}
		}
		this.setState({'feed': feed, 'hash': hash, 'added': newfeed.length});
	}

	getFeedIdsWithoutNodes() {
		var feed = this.state.feed;
		var hash = this.state.hash;

		var keys = [];
		for (var idx = 0; idx < feed.length; idx++ ) {
			if ( !feed[idx]['node'] )
				keys.push(feed[idx]['id']);
		}
		return keys;
	}

	getMissingNodes() {
		var keys = this.getFeedIdsWithoutNodes();

		if ( keys.length ) {
			return $Node.GetKeyed( keys )
				.then(r => {
					var feed = this.state.feed;
					var hash = this.state.hash;

					for ( var node_id in r.node ) {
						var id = r.node[node_id].id;

						feed[hash[id]].node = r.node[node_id];
					}

					this.setState({'feed': feed, 'hash': hash});
				})
				.catch(err => {
					this.setState({ 'error': err });
				});
		}

	}

	getFeed( id, methods, types, subtypes, subsubtypes, more, limit ) {
		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, more, limit )
		.then(r => {
            this.setState({'loaded':true});
            // make sure we have a feed
			if ( r.feed && r.feed.length ) {
				this.appendFeed(r.feed);
				return this.getMissingNodes();
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

//	getFeed( id, methods, types, subtypes, subsubtypes ) {
//		$Node.GetFeed( id, methods, types, subtypes, subsubtypes )
//		.then(r => {
//			// If the feed is not empty
//			if ( r.feed && r.feed.length ) {
//				var keys = r.feed.map(v => v['id']);
//				$Node.Get( keys )
//					.then(rr => {
//						// Make a id mapping object
//						let nodemap = {};
//						for ( let idx = 0; idx < rr.node.length; idx++ ) {
//							nodemap[rr.node[idx].id] = rr.node[idx];
//						}
//
//						// Using the original keys, return an ordered array of nodes
//						let new_state = {
//							'feed': keys.map(v => nodemap[v])
//						};
//
//						this.setState(new_state);
//					})
//					.catch(err => {
//						this.setState({ 'error': err });
//					});
//			}
//			else {
//				this.setState({ 'feed': [] });
//			}
//		})
//		.catch(err => {
//			this.setState({ 'error': err });
//		});
//	}

	fetchMore( offset ) {
		var props = this.props;
		var offset = this.state.offset;
//		var morenode = this.state.feed[this.state.feed.length-1];
//		var more = morenode.created ? morenode.created : morenode.modified;

		this.getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['post'],
			props.subtypes ? props.subtypes : null,
			props.subsubtypes ? props.subsubtypes : null,
			offset,
			this.props.limit ? this.props.limit : 15
		);

		this.setState({'offset': offset+10});
	}

	makeFeedItem( node ) {
		node = node.node;

		if ( node ) {
			var path = this.props.path+'/'+node.slug;
			var user = this.props.user;
			var extra = this.props.extra;

			if ( node.type === 'post' || node.type === 'game' ) {
				return <ContentPost node={node} user={user} path={path} extra={extra} authored by minmax love comments minimized={this.props.minimized} />;
			}
			else if ( node.type === 'user' ) {
				return <ContentUser node={node} user={user} path={path} extra={extra} minmax />;
			}
			else {
				return <div class='content-base'>Unsupported Node Type: {""+node.type}</div>;
			}
		}
		return null;
	}

	render( props, {feed, added, error, loaded} ) {
		var ShowFeed = null;

		if ( error ) {
			ShowFeed = error;
		}
        else if ( loaded && feed && feed.length == 0){
            ShowFeed = <ContentCommon {...props}><h1>Sorry, there are no {props.types[0]}</h1></ContentCommon>;
        }
		else if ( loaded && feed && feed.length ) {
			ShowFeed = [];
			if ( feed.length ) {
				ShowFeed = feed.map(this.makeFeedItem);
			}
			if ( !props.nomore /*|| added >= 10*/ )
				ShowFeed.push(<ContentMore onclick={this.fetchMore} />);
		}
		else {
			ShowFeed = <NavSpinner />;
		}

		// TERRIBLE HACK! There are two #content's!!
		return (
			<div id="content">
				{props.children}
				{ShowFeed}
			</div>
		);
	}
}
