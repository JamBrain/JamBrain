import {Component} from 'preact';
import UIIcon 							from 'com/ui/icon';
import NavLink 							from 'com/nav-link/link';

import $Node							from 'shrub/js/node/node';

export default class ContentFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}

	render( {node, href}, {} ) {
		if ( node && Number.isInteger(node.comments) ) {
			return (
				<NavLink href={href} class="footer-button footer-button-comments" title="Comments">
					<UIIcon>bubbles</UIIcon>
					<div class="-count">{node.comments}</div>
				</NavLink>
			);
		}
		return null;
	}
}
