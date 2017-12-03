import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentCommonFooterButtonComments extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node} = props;

		let CountClass = '';
		if ( node.notes >= 10 )
			CountClass = '-count-10';
		else if ( node.notes >= 4 )
			CountClass = '-count-4';
		else if ( node.notes >= 1 )
			CountClass = '-count-1';

		if ( node && Number.isInteger(node.notes) ) {
			return (
				<NavLink href={node.path} class={cN("content-common-footer-button -comments", CountClass)} title="Comments">
					<SVGIcon>bubbles</SVGIcon>
					<div class="-count">{node.notes}</div>
				</NavLink>
			);
		}
		return null;
	}
}
