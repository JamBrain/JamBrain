import {h, Component} 					from 'preact/preact';

import ContentHeadliner					from 'com/content-headliner/headliner';
import $Node							from 'shrub/js/node/node';

export default class ContentHeadlinerFeed extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'feed': null,
			'nodes': null,
		};
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
			this.props.limit
		);
	}

	getFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit ) {
		$Node.GetFeed( id, methods, types, subtypes, subsubtypes, tags, more, limit )
		.then(r => {
			if ( r && r.feed && r.feed.length ) {
				this.setState({'feed': r.feed});
				return $Node.Get(r.feed);
			}
			return null;
		})
		.then(r => {
			if ( r && r.node ) {
				this.setState({'nodes': r.node});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	render( props, state ) {
		if ( state.nodes ) {
			// TODO: Nodes should be ordered by feed
			return <ContentHeadliner {...props} node={state.nodes} />;
		}

		return null;
	}
}
