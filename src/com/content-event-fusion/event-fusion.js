import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


export default class ContentEventFusion extends Component {
	constructor( props ) {
		super(props);

	}
	
	componentDidMount() {
	}


	render( {node, user, path, extra}, {error} ) {
		var Title = <h3>Theme Fusion Round</h3>;
		
		if ( user && user['id'] ) {
			return (
				<div class="-body">
					{Title}
					<div>welcome</div>
				</div>
			);
		}
		else {
			return (
				<div class="-body">
					{Title}
					<div>Please log in</div>
				</div>
			);
		}
	}
}
