import {h, Component} from 'preact';
import cN from 'classnames';

import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentCommonFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node} = props;

		let CountClass = '';
		if ( node.comments >= 10 )
			CountClass = '-count-10';
		else if ( node.comments >= 4 )
			CountClass = '-count-4';
		else if ( node.comments >= 1 )
			CountClass = '-count-1';

		if ( node && Number.isInteger(node.comments) ) {
			return (
				<NavLink href={node.path} class={cN("content-common-footer-button -comments", CountClass)} title="Comments">
					<SVGIcon>bubbles</SVGIcon>
					<div class="-count">{node.comments}</div>
				</NavLink>
			);
		}
		return null;
	}
}
