import {h, Component} from 'preact';
import cN from 'classnames';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content/error';

import ContentCommon					from 'com/content-common/common';
import ContentItemBox					from 'com/content-item/item-box';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentMore						from 'com/content-more/more';

import ChangeableGrid 					from 'com/grid/changeable-grid';

import $Node							from 'shrub/js/node/node';


export default class ContentGames extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'feed': [],
			'inFeed': {},
			'nodes': {},
			'firstLoad': false,
			//'hash': {},
			'offset': 24-5,
			//'added': null,
		};

		// Bound in the definition, so we can include state
		//this.fetchMore = this.fetchMore.bind(this);
	}


	componentDidMount() {
		let props = this.props;

		this._getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['item'],
			props.subtypes ? props.subtypes : ['game'],
			props.subsubtypes ? props.subsubtypes : null,
			props.tags ? props.tags : null,
			null,
			this.props.limit ? this.props.limit : 24
		);
	}

	_appendFeed( newFeed ) {
		$Node.GetKeyed(newFeed)
		.then(r => {
			this.setState(prevState => {
				//console.log("set", prevState);
				let feed = [...prevState.feed];
				let inFeed = {...prevState.inFeed};
				let nodes = {...prevState.nodes, ...r.node};

				// For all items in the new feed
				for ( const item of newFeed ) {
					// Item is in the feed
					if ( item.id in inFeed ) {
						// If the item is newer, update it
						if ( Date.parse(item.modified) > Date.parse(feed[inFeed[item.id]].modified) ) {
							feed[inFeed[item.id]] = item;
						}
					}
					// if not, add it
					else {
						inFeed[item.id] = feed.length;
						feed.push(item);
					}
				}

				let ret = {'feed': feed, 'inFeed': inFeed, 'nodes': nodes, 'firstLoad': true};
				//console.log("dun", ret);
				return ret;
			});
		});
	}

/*
	_appendFeed( newFeed ) {
		this.setState(prevState => {
			let feed = [...prevState.feed];
			let inFeed = {...prevState.inFeed};
			let changed = [...prevState.changed];

			// For all items in the new feed
			for ( const item of newFeed ) {
				// Item is in the feed
				if ( item.id in inFeed ) {
					// If the item is newer, update it
					if ( Date.parse(item.modified) > Date.parse(feed[inFeed[item.id]].modified) ) {
						feed[inFeed[item.id]] = item;
						changed.push(item.id);
					}
				}
				// if not, add it
				else {
					inFeed[item.id] = feed.length;
					changed.push(item.id);
					feed.push(item);
				}
			}
			$Node.GetKeyed(changed)
			.then(r => {
				this.setState(prevState => {
					return {'node': {...prevState.nodes, ...r.node}, 'firstLoad': true};
				});
			});

			return {'feed': feed, 'inFeed': inFeed, 'firstLoad': true};
		});
	}

/*
	_appendFeed( newfeed ) {
		console.log("append", newfeed);
		this.setState(prevState => {
			let feed = prevState.feed;
			let hash = prevState.hash;

			//console.log("b4", feed, hash);

			let keys = [];

			for ( let node of newfeed ) {
				if ( !hash[node.id] ) {
					hash[node.id] = feed.length;
					//feed.push(info);
					keys.push(node);
				}
			}

			$Node.GetKeyed( keys )
			.then(r => {
				this.setState(() => {
					//let feed = prevState.feed;
					//const hash = prevState.hash;

					//console.log("hush", feed, hash);
*
					for ( let node of r.node ) {
						feed[hash[node.id]].node = node;
					}

					//return {'feed': feed};

					return {
						'feed': feed,
						'hash': hash,
						'added': newfeed.length
					};
				});
			})
			.catch(err => {
				this.setState({ 'error': err });
			});

			return null;



			console.log("aftr", feed, hash);

			return {
				'feed': feed,
				'hash': hash,
				'added': newfeed.length
			};

		});
	}
*/
/*
	getFeedIdsWithoutNodes() {
		let feed = this.state.feed;
		//var hash = this.state.hash;

		var keys = [];
		for (var idx = 0; idx < feed.length; idx++ ) {
			if ( !feed[idx]['node'] )
				keys.push(feed[idx]['id']);
		}
		return keys;
	}
*/

/*
	_getMissingNodes( newFeed ) {
		let keys = newFeed;//this.state.feed;//this.getFeedIdsWithoutNodes();

		//console.log("MEOOO", this.state.feed, newFeed);

		if ( keys.length ) {
			return $Node.GetKeyed( keys )
				.then(r => {
					this.setState(prevState => {
						let feed = prevState.feed;
						const hash = prevState.hash;

						console.log("hush", feed, hash);

						for ( let node of r.node ) {
							feed[hash[node.id]].node = node;
						}

						.then(() => {
							return this._getMissingNodes(r.feed);
						});

						return {'feed': feed};
					});
				})
				.catch(err => {
					this.setState({ 'error': err });
				});
		}
		return null;
	}
*/

	_getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		return $Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
		.then(r => {
			//this.setState({ 'loaded': true });
			//console.log("getfeed", r);

			if ( r.status == 200 ) {
				return this._appendFeed(r.feed);
			}
		})
		.catch(err => {
			//console.log("failfeed");
			this.setState({'error': err});
		});
	}


	_fetchMore( offset ) {
		// @ifdef DEBUG
		console.log("[com/ContentGames]", "fetchMore", offset);
		// @endif

		var props = this.props;
//		var morenode = this.state.feed[this.state.feed.length-1];
//		var more = morenode.created ? morenode.created : morenode.modified;

		// Step the offset
		this.setState({'offset': offset + 24});

		// Fetch the feed (given the old offset)
		this._getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['item'],
			props.subtypes ? props.subtypes : ['game'],
			props.subsubtypes ? props.subsubtypes : null,
			props.tags ? props.tags : null,
			offset,
			this.props.limit ? this.props.limit : 24+5
		);
	}

	static _matchesFilter(node, filter) {
		if ( node === undefined ) {
			return false;
		}
		//console.log(filter);
		if ( filter && filter.active ) {
			const {wordsLowerCase} = filter;
			if ( wordsLowerCase.length > 0 ) {
				let matches = 0;
				wordsLowerCase.forEach((text) => {

					if ( text && (node.name.toLowerCase().indexOf(text) > -1 || node.body.toLowerCase().indexOf(text) > -1) ) {
						matches++;
					}
				});
				return matches > 0;
			}
			//TODO: check tags
			return true;
		}
		return true;
	}

	render( props, state ) {
		const {filter} = props;
		let {feed, nodes, offset, firstLoad, error, layout} = state;

		let LoadMore = null;

		if ( error ) {
			return <ContentError code={400}>Bad Request: Couldn't load games ({error})</ContentError>;
		}
		else if ( firstLoad && (feed.length > 0) ) {
			if ( !props.nomore /*|| added >= 10*/ ) {
				LoadMore = <ContentMore onClick={this._fetchMore.bind(this, offset)} />;
			}

			let games = feed.map((r, index) => {
				let id = r.id;
				let node = nodes[id];
				if ( node && ContentGames._matchesFilter(node, filter) ) {
					return (
						<ContentItemBox
							node={node}
							path={props.path}
							noevent={props.noevent ? props.noevent : null}
						/>
					);
				}
			});

			return (
				<div class={cN('content', props.class)}>
					{props.children}
					<ChangeableGrid columns={layout}>
						{games}
					</ChangeableGrid>
					{LoadMore}
				</div>
			);
		}
		else if ( firstLoad && (feed.length == 0) ) {
			return (
				<ContentCommon {...props}>
					<ContentCommonBodyTitle href={""} title={"No Games!"} />
					<ContentCommonBody>Sorry, no published games found</ContentCommonBody>
				</ContentCommon>
			);
		}

		// Show a spinner whilst were loading
		return <ContentLoading />;
	}
}
