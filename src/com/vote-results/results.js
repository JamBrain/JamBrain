import { h, Component } 				from 'preact/preact';

import ContentCommonBody				from 'com/content-common/common-body';


export default class VoteResults extends Component {

	constructor( props ) {
		super(props);
	}

	hasFinalResults(grandParent) {
		return !parseInt(node_CanGrade(grandParent)) && node_isEventFinished(grandParent);
	}
	render() {

		const parent = state.parent;
		const grandParent = state.parent.parent;

		if (!hasFinalResults(grandParent)) {
			return null;
		}
		
		const node = parent.props.node;
		const user = parent.props.user;
		const path = parent.props.path;
		const extra = parent.props.extra;
		const featured = parent.props.featured;
		
		let Lines = [];

		for ( let key in grandParent.meta ) {
			// Is it a valid grade ?
			let parts = key.split('-');
			if ( parts.length == 2 && parts[0] == 'grade' ) {
				// Make sure they user hasn't opted out
				
				if ( node.meta && !(node.meta[key+'-out']|0) ) {
					Lines.push({'key': key, 'value': grandParent.meta[key]});
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