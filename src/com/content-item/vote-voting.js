import { h, Component } 				from 'preact/preact';

import SVGIcon 							from 'com/svg-icon/icon';

import ButtonBase						from 'com/button-base/base';

import ContentCommonBody				from 'com/content-common/common-body';

import $Grade							from '../../shrub/js/grade/grade';


export default class VoteVoting extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {			
			'grade': null,			
		};

	}
	
	static canReciveVotes(featured, node) {		
		return featured && node && featured.what_node && nodeKeys_HasPublishedParent(featured.what_node, node.parent);
	}
	
	onGrade( name, value ) {
		var Node = this.props.node;
		
		return $Grade.Add(Node.id, name, value)
			.then(r => {
				if ( r && r.id || !!r.changed ) {
					var Grades = this.state.grade;
					
					Grades[name] = value;
					
					this.setState({'grade': Grades});
				}
				return r;
			});
	}
	
	componentDidMount() {
		$Grade.GetMy(this.props.node.id)
			.then(r => {
				if ( r.grade ) {
					this.setState({'grade': r.grade});
				}
				else {
					this.setState({'grade': []});
				}
			})
			.catch(err => {
				this.setState({ 'error': err });
			});
	}
	
	render(props, state) {
		
		const nodeComponent = this.props.nodeComponent;
		const node = this.props.node;

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
			let Score = '?';
			if ( state.grade ) {
				Score = state.grade[Line.key] ? state.grade[Line.key] : 0;
			}
			
			let Stars = [];
			for ( let idx2 = 0; idx2 < Score; idx2++ ) {
				Stars.push(<ButtonBase class='-star' onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-full</SVGIcon></ButtonBase>);
			}
			for ( let idx2 = Score; idx2 < 5; idx2++ ) {
				Stars.push(<ButtonBase class='-star' onclick={this.onGrade.bind(this, Line.key, idx2+1)}><SVGIcon small baseline>star-empty</SVGIcon></ButtonBase>);
			}
			Stars.push(<ButtonBase class='-delete' onclick={this.onGrade.bind(this, Line.key, 0)}><SVGIcon small>cross</SVGIcon></ButtonBase>);
			
			VoteLines.push(<div class="-grade"><span class="-title">{Title}:</span> {Stars}</div>);
		}
		
		let ShowRatingSubText = null;
		if ( node.subsubtype == 'jam' )
			ShowRatingSubText = <div class="-subtext">Jam game</div>;
		else if ( node.subsubtype == 'compo' )
			ShowRatingSubText = <div class="-subtext">Compo game</div>;
		
		return (
			<ContentCommonBody class="-rating">
				<div class="-header">Ratings</div>
				{ShowRatingSubText}
				<div class="-items">{VoteLines}</div>
				<div class="-footer">Ratings are saved automatically when you click. When they change, they're saved.</div>
			</ContentCommonBody>
		);

	}
	
	
}