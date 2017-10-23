import {h, Component} 				from 'preact/preact';

import NavLink							from 'com/nav-link/link';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import PieChart							from 'com/visualization/piechart/piechart';


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

			//console.log(state.stats);

			var EventMode = 0;
			if ( node && node.meta && node.meta['theme-mode'] )
				EventMode = parseInt(node.meta['theme-mode']);

			var Data = [];
			if ( EventMode ) {
				Data.push(<div class="-gap"><span class="-title">Number of Users:</span></div>);
				Data.push(<div><span>Signups:</span> <span class="-value">{stats.signups}</span></div>);
				Data.push(<div><span>Unique Authors:</span> <span class="-value">{stats.authors}</span></div>);

				if ( EventMode >= 5 ) {
					Data.push(<div class="-gap"><span class="-title">Number of Submissions:</span> <span class="-value -title">{stats.jam+stats.compo+stats.craft}</span></div>);
					let entries = [
						stats.compo,
						stats.jam
					];
					let entrienames = [
						'Jam',
						'Compo'
					];
					Data.push(<PieChart values={entries} labels={entrienames}></PieChart>);

					Data.push(<div><span>Unfinished:</span> <span class="-value">{stats.unfinished}</span></div>);
					Data.push(<div><span>Unpublished:</span> <span class="-value">{stats.unpublished}</span></div>);
					Data.push(<div><span>Warmups:</span> <span class="-value">{stats.warmup}</span></div>);
				}
				if ( EventMode >= 6 ) {
					Data.push(<div class="-gap"><span class="-title">Number of Ratings Recived (Per Game):</span></div>);
					let grades = [
						stats['grade-20-plus'],
						stats['grade-15-20'],
						stats['grade-10-15'],
						stats['grade-5-10'],
						stats['grade-0-5']-stats['grade-0-only'],
						stats['grade-0-only']
					];
					let gradenames = [
						'20-plus',
						'15-20',
						'10-15',
						'5-10',
						'1-5',
						'0'
					];
					Data.push(<PieChart values={grades} labels={gradenames}></PieChart>);

					Data.push(<div class="-gap"><span class="-title">Types of Entries:</span></div>);
					let types = [
						stats.game,
						stats.craft,
						stats.demo,
						stats.tool
					];
					let typenames = [
						'Games',
						'Crafts',
						'Demos',
						'Tools'
					];
					Data.push(<PieChart values={types} labels={typenames}></PieChart>);

				}

				Data.push(<div class="-gap">Last Updated: {stats.timestamp}</div>);

				return (
					<ContentCommon {...props} class={cN(Class)}>
						<ContentCommonBodyTitle title="Statistics" />
						<ContentCommonBody>
							{Data}
						</ContentCommonBody>
					</ContentCommon>
				);
			}
			return <div />;
/*
			return (
				<ContentCommon {...props} class={cN(Class)}>
					<ContentCommonBodyTitle title="Statistics" />
					<ContentCommonBody>
						<div><span class="-title">Signups:</span> <span class="-value">{stats.signups}</span></div>
						<div><span class="-title">Unique Authors:</span> <span class="-value">{stats.authors}</span></div>

						<div class="-gap"><span class="-title">Submissions:</span> <span class="-value">{stats.jam+stats.compo+stats.craft}</span></div>
						<div class="-indent"><span class="-title">Jam:</span> <span class="-value">{stats.jam}</span></div>
						<div class="-indent"><span class="-title">Compo:</span> <span class="-value">{stats.compo}</span></div>
						<div class="-indent"><span class="-title">Craft:</span> <span class="-value">{stats.craft}</span></div>
						<div><span class="-title">Unfinished:</span> <span class="-value">{stats.unfinished}</span></div>
						<div><span class="-title">Unpublished:</span> <span class="-value">{stats.unpublished}</span></div>
						<div><span class="-title">Warmups:</span> <span class="-value">{stats.warmup}</span></div>

						<div class="-gap"><span class="-title">Ratings:</span></div>
						<div class="-indent"><span class="-title">20+:</span> <span class="-value">{stats['grade-20-plus']}</span></div>
						<div class="-indent"><span class="-title">15-20:</span> <span class="-value">{stats['grade-15-20']}</span></div>
						<div class="-indent"><span class="-title">10-15:</span> <span class="-value">{stats['grade-10-15']}</span></div>
						<div class="-indent"><span class="-title">5-10:</span> <span class="-value">{stats['grade-5-10']}</span></div>
						<div class="-indent"><span class="-title">0-5:</span> <span class="-value">{stats['grade-0-5']}</span></div>
						<div class="-gap"><span class="-title">With 0 ratings:</span> <span class="-value">{stats['grade-0-only']}</span></div>
						<div class="-gap"><span class="-title">Totals:</span> <span class="-value">{stats.game}</span></div>
						<div class="-indent"><span class="-title">Games:</span> <span class="-value">{stats.game}</span></div>
						<div class="-indent"><span class="-title">Crafts:</span> <span class="-value">{stats.craft}</span></div>
						<div class="-indent"><span class="-title">Demos:</span> <span class="-value">{stats.demo}</span></div>
						<div class="-indent"><span class="-title">Tools:</span> <span class="-value">{stats.tool}</span></div>
						<div class="-gap">Last Updated: {stats.timestamp}</div>
					</ContentCommonBody>
				</ContentCommon>
			);
*/
		}
		else {
			return <ContentLoading />;
		}
	}
}
