import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';


export default class ContentEventTheme extends Component {
	constructor( props ) {
		super(props);

	}
	
	componentDidMount() {
	}


	render( props ) {
		return (
			<ContentCommon {...props}>
				Wine
			</ContentCommon>
		);
	}
}
