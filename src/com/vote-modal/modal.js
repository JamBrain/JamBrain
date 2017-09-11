import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import ButtonBase						from 'com/button-base/base';

import ContentCommonBody				from 'com/content-common/common-body';

import VoteResults						from 'com/vote-results/results';
import VoteCurrent						from 'com/vote-current/current';
import VoteVoting						from 'com/vote-voting/voting';


export default class VoteOrResults extends Component {
	
	constructor( props ) {
		super(props);

	}
	
	render(props, state) {
		
		const nodeComponent = props.nodeComponent;
		const node = props.node;
		const user = props.user;
		const featured = props.featured;
		
		let ShowGrade = null;
		
		if ( parseInt(node_CanGrade(nodeComponent)) ) {
			// If it's your game, show some stats
			if ( node_IsAuthor(node, user) ) {
				ShowGrade = (<VoteCurrent node={node} nodeComponent={nodeComponent} />);
			}
			// Judging
			else if ( VoteVoting.canReciveVotes(featured, node) ) {
				ShowGrade = (<VoteVoting node={node} nodeComponent={nodeComponent} />);				
			}
			else if ( !user || !user.id ) {
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						<div class="-items">Please login to rate this game</div>
					</ContentCommonBody>
				);
			}
			else {
				ShowGrade = (
					<ContentCommonBody class="-rating">
						<div class="-header">Ratings</div>
						<div class="-items">Sorry! At this time, only participants are able to rate games.</div>
					</ContentCommonBody>
				);
			}
		}
		// Final Results
		else {
			// grading is closed
			ShowGrade = (<VoteResults node={node} nodeComponent={nodeComponent} />);

		}	

		return ShowGrade;
	}
}