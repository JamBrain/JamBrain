import {h, Component} 				from 'preact/preact';

import NavLink							from 'com/nav-link/link';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';

import PieChart							from 'com/visualization/piechart/piechart';
import BarChart							from 'com/visualization/barchart/barchart';


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
				let participation = [];
				participation.push(<div class="-gap"><span class="-title">Number of Users:</span></div>);
				participation.push(<div><span>Signups:</span> <span class="-value">{stats.signups}</span></div>);
				participation.push(<div><span>Unique Authors:</span> <span class="-value">{stats.authors}</span></div>);
				Data.push(<div class="-participation">{participation}</div>);

				if ( EventMode >= 5 ) {
					let submissions = [];

					submissions.push(<div class="-gap"><span class="-title">Number of Submissions:</span> <span class="-value -title">{stats.jam+stats.compo+stats.craft}</span></div>);
					let entries = [
						stats.jam,
						stats.compo
					];
					let entrienames = [
						'Jam',
						'Compo'
					];

					submissions.push(<PieChart values={entries} labels={entrienames} use_percentages={true}></PieChart>);

					submissions.push(<div><span>Unfinished:</span> <span class="-value">{stats.unfinished}</span></div>);
					submissions.push(<div><span>Unpublished:</span> <span class="-value">{stats.unpublished}</span></div>);
					submissions.push(<div><span>Warmups:</span> <span class="-value">{stats.warmup}</span></div>);

					Data.push(<div class="section -submissions">{submissions}</div>);
				}
				if ( EventMode >= 6 ) {

					let types = [];

					types.push(<div class="-gap"><span class="-title">Types of Entries:</span></div>);
					let typescount = [
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
					types.push(<PieChart values={typescount} labels={typenames} use_percentages={true}></PieChart>);

					Data.push(<div class="section -types">{types}</div>);

					let ratings = [];

					ratings.push(<div class="-gap"><span class="-title">Ratings Received per Entry:</span></div>);
					let grades = [
						stats['grade-20-plus'],
						stats['grade-15-20'],
						stats['grade-10-15'],
						stats['grade-5-10'],
						stats['grade-0-5']-stats['grade-0-only'],
						stats['grade-0-only']
					];
					let gradenames = [
						'20 or more',
						'15 to 20',
						'10 to 15',
						'5 to 10',
						'1 to 5',
						'0'
					];

					ratings.push(<BarChart values={grades.reverse()} labels={gradenames.reverse()} use_percentages={true}></BarChart>);

					Data.push(<div class="section -ratings">{ratings}</div>);

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
		}
		else {
			return <ContentLoading />;
		}
	}
}
