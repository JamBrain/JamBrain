import {h, Component}	 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';
import ContentItemBox					from 'com/content-item/item-box';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentMore						from 'com/content-more/more';

import LayoutChangeableGrid 			from 'com/layout/grid/changeable-grid';

import $Node							from '../../shrub/js/node/node';

export default class ContentGames extends Component {

	constructor( props ) {
		super(props);

		this.state = {
			'feed': [],
			'hash': {},
			'offset': 24-5, //10-5
			'added': null,
			'loaded': false
		};

		this.fetchMore = this.fetchMore.bind(this);
	}

	componentDidMount() {
		let props = this.props;

		this.getFeed(
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

	getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
		.then(r => {
			this.setState({ 'loaded': true });

			if ( r.feed && r.feed.length ) {
				this.appendFeed(r.feed);
				return this.getMissingNodes();
			}
		})
		.catch(err => {
			this.setState({ 'error': err });
		});
	}

	fetchMore( offset ) {

		console.log("loading more");

		var props = this.props;
		var offset = this.state.offset;
//		var morenode = this.state.feed[this.state.feed.length-1];
//		var more = morenode.created ? morenode.created : morenode.modified;

		this.getFeed(
			props.node.id,
			props.methods ? props.methods : ['parent', 'superparent'],
			props.types ? props.types : ['item'],
			props.subtypes ? props.subtypes : ['game'],
			props.subsubtypes ? props.subsubtypes : null,
			props.tags ? props.tags : null,
			offset,
			this.props.limit ? this.props.limit : 24+5
		);

		this.setState({'offset': offset + 24});
	}

	static matchesFilter(node, filter) {
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
		let {feed, added, error, loaded, defaultLayout, layout} = state;

		let LoadMore = null;


		if ( error ) {
			return <ContentError code="400">"Bad Request : Couldn't load games"</ContentError>;
		}
		else if ( feed && (feed.length > 0) ) {
			if ( !props.nomore /*|| added >= 10*/ ) {
				LoadMore = <ContentMore onclick={this.fetchMore} />;
			}

			let Games = feed.map((r, index) => {
				if ( ContentGames.matchesFilter(r.node, filter) ) {
					return (
						<ContentItemBox
							node={r.node}
							user={props.user}
							path={props.path}
							noevent={props.noevent ? props.noevent : null}
						/>
					);
				}
			});

			return (
				<div class={cN('content-base', props.class)}>
					{props.children}
					<LayoutChangeableGrid columns={layout}>
						{Games}
					</LayoutChangeableGrid>
					{LoadMore}
				</div>
			);
		}
		else if ( loaded && feed && (feed.length == 0) ){
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
