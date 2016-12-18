import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';
import NavSpinner 						from 'com/nav-spinner/spinner';

import $Node							from '../../shrub/js/node/node';

export default class ContentGroup extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'items': null
		};
	}
	
	componentDidMount() {
//		$Node.
	}

	
	render( {extra}, {items} ) {
		
		if ( extra.length ) {
			return (
				<div class="content-base content-post">
					<h2><strong>404:</strong> "{extra[0]}" not found.</h2>
				</div>
			);
		}
		else if ( items ) {
			return (
				<div class="content-base content-post">
					<div>Group</div>
				</div>
			);
			
		}
		return (
			<div class="content-base content-post">
				<NavSpinner />
			</div>
		);
	}
}
