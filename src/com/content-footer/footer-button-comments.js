import {Component} from 'preact';
import './footer-button.less';

import {UIIcon} from 'com/ui';
import NavLink 							from 'com/nav-link/link';

import $Node							from 'backend/js/node/node';

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
