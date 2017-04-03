import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import $Node							from '../../shrub/js/node/node';

export default class ContentCommonFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}
	
	componentDidMount() {
	}

	render( {node, href}, {} ) {
		if ( node && Number.isInteger(node.notes) ) {
			return (
				<NavLink href={href} class="content-common-footer-button -comments" title="Comments">
					<SVGIcon>bubbles</SVGIcon>
					<div class="-count">{node.notes}</div>
				</NavLink>
			);
		}
		return null;
	}
}
