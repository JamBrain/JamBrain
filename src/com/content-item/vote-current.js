import { h, Component } 				from 'preact/preact';

import ContentCommonBody				from 'com/content-common/common-body';


export default class VoteCurrent extends Component {
	
	constructor( props ) {
		super(props);
	}

	render() {
		const node = this.props.node;
		const nodeComponent = this.props.nodeComponent;
		
		let Lines = [];

		for ( let key in nodeComponent.meta ) {
			// Is it a valid grade ?
			let parts = key.split('-');
			if ( parts.length == 2 && parts[0] == 'grade' ) {
				// Make sure they user hasn't opted out
				
				if ( node.meta && !(node.meta[key+'-out']|0) ) {
					Lines.push({'key': key, 'value': nodeComponent.meta[key]});
				}
			}
		}
		
		let VoteLines = [];
		for ( let idx = 0; idx < Lines.length; idx++ ) {
			let Line = Lines[idx];
			
			let Title = Line.value;
			let Score = 0;
			if ( node.grade ) {
				Score = node.grade[Line.key];
			}
			
			//  {Score >= 20 ? <SVGIcon small baseline>check</SVGIcon> : <SVGIcon small baseline>cross</SVGIcon>}
			
			VoteLines.push(<div class="-grade"><span class="-title">{Title}:</span> <strong>{Score}</strong></div>);
		}

		return (
			<ContentCommonBody class="-rating">
				<div class="-header">Total Ratings</div>
				<div class="-subtext">Votes on your game so far</div>
				<div class="-items">{VoteLines}</div>
				<div class="-footer">To get a score at the end, you need about <strong>20</strong> ratings in a category. To get ratings: play, rate, and leave feedback on games. Every game you rate and leave quality feedback on scores you <strong>Coolness</strong> points. Having a high "Coolness" prioritizes your game.</div>
			</ContentCommonBody>
		);
	}
	
}