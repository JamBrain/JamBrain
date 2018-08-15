import {h, Component} 					from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentMore						from 'com/content-more/more';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';

import $Node							from 'shrub/js/node/node';

export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'feed': [],
			'hash': {},
			'offset': 5, //10
			'lastadded': null,
			'loaded': false
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
			props.tags ? props.tags : null,
			null,
			this.props.limit
		);
	}

	appendFeed( newfeed ) {
		var feed = this.state.feed;
		var hash = this.state.hash;

		var added = 0;

		for ( var idx = 0; idx < newfeed.length; idx++ ) {
			var info = newfeed[idx];
			if ( !hash[info['id']] ) {
				hash[info['id']] = feed.length;
				feed.push(info);
				added++;
			}
		}
		this.setState({'feed': feed, 'hash': hash, 'lastadded': added});
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
		let keys = this.getFeedIdsWithoutNodes();

		if ( keys.length ) {
			// Arguments here to pre-cache things for later (not actually used here, but they end up in the cache)
			return $Node.GetKeyed(keys, ['author', 'parent', 'superparent'])
				.then(r => {
					let feed = this.state.feed;
					let hash = this.state.hash;

					for ( let id in hash ) {
						if ( r.node[id] ) {
							feed[hash[id]].node = r.node[id];
						}
					}

					this.setState({'feed': feed, 'hash': hash});
				})
				.catch(err => {
					this.setState({'error': ""+err});
				});
		}
	}

	getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		this.setState({'loaded': false});
		$Node.GetFeed(id, methods, types, subtypes, subsubtypes, tags, more, limit)
			.then(r => {
				this.setState({'loaded': true});

				// make sure we have a feed
				if ( r.feed && r.feed.length ) {
					this.appendFeed(r.feed);
					return this.getMissingNodes();
				}
			})
			.catch(err => {
				this.setState({'error': ""+err});
			});
	}

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
			props.tags ? props.tags : null,
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
				return <div class="content-base">Unsupported Node Type: {""+node.type}</div>;
			}
		}
		return null;
	}

	render( props, state ) {
		let {feed, lastadded, error, loaded} = state;
		let ShowFeed = [];

		if ( error ) {
			ShowFeed.push(<ContentCommon node={props.node}><ContentCommonBody>Error: {error}</ContentCommonBody></ContentCommon>);
		}
		else if ( feed && (feed.length == 0) ) {
			if ( !props.noemptymessage ) {
				ShowFeed.push(<ContentCommon node={props.node}><ContentCommonBody>Feed is empty</ContentCommonBody></ContentCommon>);
			}
		}
		else if ( feed && feed.length ) {
			ShowFeed = ShowFeed.concat(feed.map(this.makeFeedItem));
		}

		if ( !props.nomore && (lastadded > 0) ) {
			ShowFeed.push(<ContentMore loading={!loaded} onclick={this.fetchMore} />);
		}

		return (
			<ContentList class={cN("content-timeline", props.class)}>
				{ShowFeed}
			</ContentList>
		);
	}
}
