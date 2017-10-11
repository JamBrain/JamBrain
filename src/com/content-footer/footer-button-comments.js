import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import $Node							from '../../shrub/js/node/node';

export default class ContentFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}

	render( {node, href}, {} ) {
		if ( node && Number.isInteger(node.notes) ) {
			return (
				<NavLink href={href} class="footer-button footer-button-comments" title="Comments">
					<SVGIcon>bubbles</SVGIcon>
					<div class="-count">{node.notes}</div>
				</NavLink>
			);
		}
		return null;
	}
}

//					<SVGIcon class="-hover-hide">bubbles</SVGIcon>
//					<SVGIcon class="-hover-show -loved-hide">heart-plus</SVGIcon>
//					<SVGIcon class="-hover-show -loved-show">heart-minus</SVGIcon>
