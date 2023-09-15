import {Component} from 'preact';
import './common-footer-button.less';

import {Icon} from 'com/ui';
import NavLink 							from 'com/nav-link/link';

export default class ContentCommonFooterButtonEdit extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<NavLink href={props.node.path+"/edit"} class="content-common-footer-button -edit">
				<Icon>edit</Icon>
			</NavLink>
		);
	}
}
