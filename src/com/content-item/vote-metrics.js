import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import ContentCommonBody				from 'com/content-common/common-body';


export default class VoteMetrics extends Component {
	
	constructor( props ) {
		super(props);
	}

	render(props, state) {
		
		const node = props.node;
		const voteWarningValue = 20.0;
		const voteCheckmarkValue = 25.0;
		
		if ( !node.magic ) {
			return null;
		}
		
		let Lines = [];
		for ( let key in node.magic ) {
			let parts = key.split('-');

			// Ignore grades (i.e. grade-01)
			if ( parts.length && !(parts[0] == 'grade' && parts.length > 1) ) {
				Lines.push({'key': key, 'value': node.magic[key]});
			}
		}

		let SimpleLines = [];
		let AdvancedLines = [];
		for ( let idx = 0; idx < Lines.length; idx++ ) {
			let Metric = Lines[idx];

			let Star = false;
			let Warning = false;
			let Icon = null;
			let Title = Metric.key;
			let Score = Metric.value;
			
			let HoverTitle = Score;

			if ( Metric.key == 'smart' ) {
				Title = "Smart Balance";
				Star = true;
			}
			else if ( Metric.key == 'cool' ) {
				Title = "Classic Balance";
				Star = true;
			}
			else if ( Metric.key == 'grade' ) {
				Title = "Ratings received";
				Warning = Score < voteWarningValue;
				if ( !Warning ) {
					Icon = <SVGIcon baseline small>checkmark</SVGIcon>;
					HoverTitle = "This will be scored";
				}
				else {
					Icon = <SVGIcon baseline small>warning</SVGIcon>;
					HoverTitle = "The minimum needed to score is about 20";
				}
			}
			else if ( Metric.key == 'given' ) {
				Title = "Ratings given";
				if ( Score > voteCheckmarkValue ) {
					Icon = <SVGIcon baseline small>checkmark</SVGIcon>;
				}
			}
			else if ( Metric.key == 'feedback' ) {
				Title = "Karma for Feedback given";
			}
			
			let SmallScore = Score.toFixed(4);
			if ( SmallScore.length > Score.toString().length )
				SmallScore = Score.toString();

			if ( Star )
				AdvancedLines.push(<div class="-metric"><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore} *{Icon}</span></div>);
			else
				SimpleLines.push(<div class={cN("-metric", Warning ? "-warning" : "")}><span class="-title">{Title}:</span> <span class="-value" title={HoverTitle}>{SmallScore}{Icon}</span></div>);
		}

		return (
			<ContentCommonBody class="-rating">
				<div class="-header">Metrics</div>
				<div class="-subtext">Advanced data on this game</div>
				<div class="-items">
					{SimpleLines}
					{AdvancedLines}
				</div>
				<div class="-footer">Metrics update rougly every <strong>15 minutes</strong>. If they don't exactly match other data (i.e. ratings), this is because they haven't updated yet. Metrics with a <strong>*</strong> are dynamic, and change based on a variety of factors. It is normal for these numbers to go up and down.</div>
			</ContentCommonBody>
		);
	}
}