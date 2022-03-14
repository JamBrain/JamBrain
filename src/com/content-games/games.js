import {h, Component} from 'preact';
import cN from 'classnames';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';
import ContentItemBox					from 'com/content-item/item-box';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentMore						from 'com/content-more/more';

import LayoutChangeableGrid 			from 'com/layout/grid/changeable-grid';

import $Node							from 'shrub/js/node/node';


export default class ContentGames extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'feed': null,
			'hash': {},
			'offset': 24-5, //10-5
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


	_appendFeed( newfeed ) {
		this.setState(prevState => {
			let feed = prevState.feed;
			let hash = prevState.hash;

			for ( let info of newfeed ) {
				if ( !hash[info.id] ) {
					hash[info.id] = feed.length;
					feed.push(info);
				}
			}

			return {
				'feed': feed,
				'hash': hash,
				//'added': newfeed.length
			};
		});
	}

	/*
	getFeedIdsWithoutNodes() {
		var feed = this.state.feed;
		//var hash = this.state.hash;

		var keys = [];
		for (var idx = 0; idx < feed.length; idx++ ) {
			if ( !feed[idx]['node'] )
				keys.push(feed[idx]['id']);
		}
		return keys;
	}
	*/

	_getMissingNodes( newFeed ) {
		var keys = this.state.feed;//this.getFeedIdsWithoutNodes();

		console.log("MEOOO", this.state.feed, newFeed);

		if ( keys.length ) {
			return $Node.GetKeyed( keys )
				.then(r => {
					this.setState(prevState => {
						let feed = prevState.feed;
						const hash = prevState.hash;

						for ( let node of r.node ) {
							feed[hash[node.id]].node = node;
						}

						return {'feed': feed};
					});
				})
				.catch(err => {
					this.setState({ 'error': err });
				});
		}

	}


	_getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		return $Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
		.then(r => {
			//this.setState({ 'loaded': true });

			if ( r.status == 200 ) {
				this._appendFeed(r.feed);

				return this._getMissingNodes(r.feed);
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
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
		let {feed, offset, /*added,*/ error, /*loaded,*/ defaultLayout, layout} = state;

		let LoadMore = null;


		if ( error ) {
			return <ContentError code="400">"Bad Request : Couldn't load games"</ContentError>;
		}
		else if ( feed && (feed.length > 0) ) {
			if ( !props.nomore /*|| added >= 10*/ ) {
				LoadMore = <ContentMore onClick={this._fetchMore.bind(this, offset)} />;
			}

			let Games = feed.map((r, index) => {
				if ( ContentGames._matchesFilter(r.node, filter) ) {
					return (
						<ContentItemBox
							node={r.node}
							path={props.path}
							noevent={props.noevent ? props.noevent : null}
						/>
					);
				}
			});

			return (
				<div class={cN('content', props.class)}>
					{props.children}
					<LayoutChangeableGrid columns={layout}>
						{Games}
					</LayoutChangeableGrid>
					{LoadMore}
				</div>
			);
		}
		else if ( /*loaded &&*/ feed && (feed.length == 0) ){
			return (
				<ContentCommon {...props}>
					<ContentCommonBodyTitle href={""} title={"No Games!"} />
					<ContentCommonBody>Sorry, there are no published games yet</ContentCommonBody>
				</ContentCommon>
			);
		}

		// Show a spinner whilst were loading
		return <ContentLoading />;
	}
}
