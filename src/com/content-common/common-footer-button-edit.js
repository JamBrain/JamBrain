import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentCommonFooterButtonEdit extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<NavLink href={props.node.path+"/edit"} class="content-common-footer-button -edit">
				<SVGIcon>edit</SVGIcon>
			</NavLink>
		);
	}
}
