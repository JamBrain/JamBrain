import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

import $Node							from '../../shrub/js/node/node';

export default class ContentFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}
	
	componentDidMount() {
	}

	render( {node}, {} ) {
		if ( node && Number.isInteger(node.notes) ) {
			return (
				<div class="footer-button footer-button-comments" title="Comments">
					<SVGIcon>bubbles</SVGIcon>
					<div class="-count">{node.notes}</div>
				</div>
			);
		}
		return null;
	}
}

//					<SVGIcon class="-hover-hide">bubbles</SVGIcon>
//					<SVGIcon class="-hover-show -loved-hide">heart-plus</SVGIcon>
//					<SVGIcon class="-hover-show -loved-show">heart-minus</SVGIcon>
