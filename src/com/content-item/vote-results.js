import { h, Component } 				from 'preact/preact';

import ContentCommonBody				from 'com/content-common/common-body';


export default class VoteResults extends Component {

	constructor( props ) {
		super(props);
	}

	hasFinalResults() {
		const nodeComponent = this.props.nodeComponent;
		return !parseInt(node_CanGrade(nodeComponent)) && node_isEventFinished(nodeComponent);
	}
	
	positionSuffix(position) {
	    let j = position % 10;
		let k = position % 100;
	
	    if (j == 1 && k != 11) return "st";
	    if (j == 2 && k != 12) return "nd";
	    if (j == 3 && k != 13) return "rd";
	    return "th";
	}
	
	render(props, state) {
				
		if (!this.hasFinalResults()) {
			return null;
		}

		const nodeComponent = props.nodeComponent;
		const node = props.node;		
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
		
		let ResultLines = [];
		for ( let idx = 0; idx < Lines.length; idx++ ) {
			let Line = Lines[idx];
			
			let Title = Line.value;
			let Place = "N/A";
			if ( node.magic && node.magic[Line.key+'-result'] )
				Place = node.magic[Line.key+'-result'];
			let Average = 0;
			if ( node.magic && node.magic[Line.key+'-average'] )
				Average = node.magic[Line.key+'-average'];
			let Count = 0;
			if ( node.grade && node.grade[Line.key] )
				Count = node.grade[Line.key];
			
			//  {Score >= 20 ? <SVGIcon small baseline>check</SVGIcon> : <SVGIcon small baseline>cross</SVGIcon>}
			
			ResultLines.push(<div class="-grade"><span class="-title">{Title}:</span> <strong>{Place}</strong><sup>{this.positionSuffix(Place)}</sup> ({Average} average from {Count} ratings)</div>);
		}

		return (
			<ContentCommonBody class="-rating">
				<div class="-header">Results</div>
				<div class="-subtext">Final results</div>
				<div class="-items">{ResultLines}</div>
				<div class="-footer">When a line is <strong>N/A</strong>, it means there weren't enough ratings for a reliable score. Don't forget to play and rate other people's games during events to prioritize your game.</div>
			</ContentCommonBody>
		); //'

	}
}