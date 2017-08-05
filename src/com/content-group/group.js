import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';
import NavSpinner 						from 'com/nav-spinner/spinner';
//import SVGIcon							from 'com/svg-icon/icon';

import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

import $Node							from '../../shrub/js/node/node';

export default class ContentGroup extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'items': null
		};
	}
	
	componentDidMount() {
//		$Node.GetFeed().then( r => {
//				
//			});
	}

	
	render( {node, user, extra, featured}, {items} ) {
		let ShowBody = null;
		
		if ( items ) {
			ShowBody = [
				<div>horse</div>
			];
		}
		else {
			ShowBody = <NavSpinner />;
		}

		return (
			<Common node={node} user={user}>
				<h2>Group: {node.name}</h2>
				<CommonBody>
					{ShowBody}
				</CommonBody>
			</Common>
		);
	}
}
