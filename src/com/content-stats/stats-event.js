import { h, Component } 				from 'preact/preact';

import NavLink							from 'com/nav-link/link';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import $Stats							from '../../shrub/js/stats/stats';


export default class ContentStatsEvent extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'stats': null
		};
	}
	
	componentDidMount() {
		//var props = this.props;
		var state = this.state;
		
//		if ( state.stats )
		this.getStats();
	}

//	componentWillUpdate( newProps, newState ) {
//		if ( this.props.node !== newProps.node ) {
//			if ( this.props.authored ) {
//				this.getAuthor(newProps.node);
//			}
//			if ( this.props.authors ) {
//				this.getAuthors(newProps.node);
//			}
//		}
//	}

	getStats() {
		var props = this.props;
		
		$Stats.Get(props.node.id).then(r => {
			if ( r.stats ) {
				this.setState({'stats': r.stats});
			}
		});
	}
	
	render( props, state ) {
		props = Object.assign({}, props);	// Shallow copy we can change props
		var Class = [];

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		if ( node && node.slug && state.stats ) {
			var stats = state.stats;
			
			Class.push("content-stats");
			Class.push("content-stats-event");
			
			console.log(state.stats);

			return (
				<ContentCommon {...props} class={cN(Class)}>
					<ContentCommonBodyTitle title="Statistics" />
					<ContentCommonBody>
						<div><span class="-title">Signups:</span> <span class="-value">{stats.signups}</span></div>
						<div><span class="-title">Unique Authors:</span> <span class="-value">{stats.authors}</span></div>
						<div class="-gap"><span class="-title">Submissions:</span> <span class="-value">{stats.jam+stats.compo+stats.craft}</span></div>
						<div><span class="-title -indent">Jam:</span> <span class="-value">{stats.jam}</span></div>
						<div><span class="-title -indent">Compo:</span> <span class="-value">{stats.compo}</span></div>
						<div><span class="-title -indent">Craft:</span> <span class="-value">{stats.craft}</span></div>
						<div><span class="-title">Unfinished:</span> <span class="-value">{stats.unfinished}</span></div>
						<div><span class="-title">Unpublished:</span> <span class="-value">{stats.unpublished}</span></div>
						<div><span class="-title">Warmups:</span> <span class="-value">{stats.warmup}</span></div>
						<div class="-gap"><span class="-title">Totals:</span> <span class="-value">{stats.games}</span></div>
						<div><span class="-title -indent">Games:</span> <span class="-value">{stats.games}</span></div>
						<div><span class="-title -indent">Crafts:</span> <span class="-value">{stats.craft}</span></div>
						<div><span class="-title -indent">Demos:</span> <span class="-value">{stats.demo}</span></div>
						<div class="-gap"><span class="-title">Ratings:</span></div>
						<div><span class="-title -indent">20+:</span> <span class="-value">{stats['grade-20-plus']}</span></div>
						<div><span class="-title -indent">15-20:</span> <span class="-value">{stats['grade-15-20']}</span></div>
						<div><span class="-title -indent">10-15:</span> <span class="-value">{stats['grade-10-15']}</span></div>
						<div><span class="-title -indent">5-10:</span> <span class="-value">{stats['grade-5-10']}</span></div>
						<div><span class="-title -indent">0-5:</span> <span class="-value">{stats['grade-0-5']}</span></div>
						<div class="-gap"><span class="-title">With 0 ratings:</span> <span class="-value">{stats['grade-0-only']}</span></div>
						<div class="-gap">Last Updated: {stats.timestamp}</div>
					</ContentCommonBody>
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
