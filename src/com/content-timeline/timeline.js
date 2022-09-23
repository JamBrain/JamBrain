import {h, Component, Fragment} from 'preact';
import cN from 'classnames';

import ContentPost				from 'com/content-post/post';
import ContentUser				from 'com/content-user/user';
import ContentMore				from 'com/content-more/more';

import UISpinner 				from 'com/ui/spinner';

import ContentCommon			from 'com/content-common/common';
import ContentCommonBody		from 'com/content-common/common-body';

import $Node					from 'shrub/js/node/node';


const TIMELINE_STEP_BUFFER = 5;
const TIMELINE_STEP = 10;


export default class ContentTimeline extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'feed': [],
			'inFeed': {},
			'nodes': {},
			//'hash': {},
			'position': TIMELINE_STEP_BUFFER,
			'isLoading': false,		// if currently loading
			'hasLoaded': false,		// has loaded at least once
		};

		this.makeFeedItem = this.makeFeedItem.bind(this);
	}

	componentDidMount() {
		let props = this.props;

		this.getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['post'],
			props.subtypes ? props.subtypes : null,
			props.subsubtypes ? props.subsubtypes : null,
			props.tags ? props.tags : null,
			null,
			props.limit ? props.limit : TIMELINE_STEP - TIMELINE_STEP_BUFFER
		);
	}

	/*
	appendFeed( newfeed ) {
		let feed = this.state.feed;
		let hash = this.state.hash;

		let added = 0;

		for ( let idx = 0; idx < newfeed.length; idx++ ) {
			let info = newfeed[idx];
			if ( !hash[info['id']] ) {
				hash[info['id']] = feed.length;
				feed.push(info);
				added++;
			}
		}

		this.setState({'feed': feed, 'hash': hash, 'lastadded': added});
	}

	getFeedIdsWithoutNodes() {
		let feed = this.state.feed;

		let keys = [];
		for (let idx = 0; idx < feed.length; idx++ ) {
			if ( !feed[idx]['node'] )
				keys.push(feed[idx]['id']);
		}
		return keys;
	}

	getMissingNodes() {
		let keys = this.state.feed;

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
					this.setState({'error': err});
				});
		}
	}
	*/

	getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		this.setState({'isLoading': true});

		return $Node.GetFeed(id, methods, types, subtypes, subsubtypes, tags, more, limit)
		.then(r => {
			if ( !r || !r.feed ) {
				// MK: Is this even needed?
				return null;
			}

			const newFeed = r.feed;

			// if we have new feed items
			if ( newFeed.length ) {
				return $Node.GetKeyed(newFeed, ['author', 'parent', 'superparent'])
				.then( r => {
					if ( !r || !r.node ) {
						// MK: Is this even needed?
						return null;
					}

					const newNodes = r.node;

					this.setState( prevState => {
						let feed = [...prevState.feed];
						let inFeed = {...prevState.inFeed};
						let nodes = {...prevState.nodes};

						for (let idx = 0; idx < newFeed.length; ++idx) {
							let newItem = newFeed[idx];

							// If item is already in the feed
							if (inFeed[newItem.id]) {
								let oldItem = feed[inFeed[newItem.id]];

								if (Date.parse(newItem.modified) > Date.parse(oldItem.modified)) {
									feed[inFeed[newItem.id]] = newItem;
									nodes[newItem.id] = newNodes[newItem.id];
								}
							}
							// Otherwise, add it
							else {
								inFeed[newItem.id] = feed.length;
								feed.push(newItem);
								nodes[newItem.id] = newNodes[newItem.id];
							}
						}

						// Do this after, so
						//let nodes = {...prevState.nodes, ...newNodes};

						//console.log(feed);

						return {'feed': feed, 'inFeed': inFeed, 'nodes': nodes};
					});

					return r;
				});
			}

			return null;
		})
		.then( r => {
			this.setState({'hasLoaded': true, 'isLoading': false});
			return r;
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}


	fetchMore( props, position ) {
		this.getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['post'],
			props.subtypes ? props.subtypes : null,
			props.subsubtypes ? props.subsubtypes : null,
			props.tags ? props.tags : null,
			position,
			props.limit ? props.limit : (TIMELINE_STEP + TIMELINE_STEP_BUFFER)
		);

		this.setState({'position': position + TIMELINE_STEP});
	}


	makeFeedItem( item ) {
		let node = this.state.nodes[item.id];
		//console.log(item);

		if ( node && this.props ) {
			let path = this.props.path+'/'+node.slug;
			let user = this.props.user;
			let extra = this.props.extra;

			let key = 'node-'+node.id;

			if ( node.type === 'post' || node.type === 'game' ) {
				return <ContentPost key={key} node={node} user={user} path={path} extra={extra} authored by minmax love comments minimized={this.props.minimized} />;
			}
			else if ( node.type === 'user' ) {
				return <ContentUser key={key} node={node} user={user} path={path} extra={extra} minmax />;
			}
			else {
				return <div key={key} class="content">Unsupported Node Type: {""+node.type}</div>;
			}
		}
		return null;
	}


	render( props, state ) {
		let {feed, error, hasLoaded, isLoading} = state;
		let content = [];

		// Error section at the start
		if ( error ) {
			content.push(<ContentCommon key="error" node={props.node}><ContentCommonBody>Error: {""+error}</ContentCommonBody></ContentCommon>);
		}
		// If not errored and not loaded anything, show a spinner
		else if ( !hasLoaded ) {
			return <UISpinner />;
		}

		// Feed
		if ( feed.length > 0 ) {
			//console.log("start");
			content.push(<Fragment>{feed.map(this.makeFeedItem)}</Fragment>);
		}
		// Empty Feed
		else if ( !props.noemptymessage ) {
			content.push(<ContentCommon key="empty" node={props.node}><ContentCommonBody>Feed is empty</ContentCommonBody></ContentCommon>);
		}

		// More button at the end
		if ( !props.nomore ) {
			content.push(<ContentMore key="more" loading={isLoading} onClick={this.fetchMore.bind(this, props, state.position)} />);
		}

		return <Fragment>{content}</Fragment>;
	}
}
