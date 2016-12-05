import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeList						from '../../shrub/js/theme/theme_list';


export default class ContentEventList extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'lists': null,
			'names': null
		}
		
		this.renderList = this.renderList.bind(this);
	}
	
	componentDidMount() {
		$ThemeList.Get(this.props.node.id)
		.then(r => {
			if ( r.lists ) {
				this.setState({ 'lists': r.lists, 'names': r.names });
			}
			else {
				this.setState({ 'lists': [] });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}	
	
	renderList( list ) {
		
	}
	
	
	render( {node, user, path, extra}, {lists, error} ) {
		var Title = <h3>Theme Voting Round</h3>;
		
		if ( user && user['id'] && lists ) {
			return (
				<div class="-body">
					{Title}
					<div>Round begins soon...</div>
					{this.renderList(1);}
					
					<div>{"Sorry! Still running behind. Needed a few hours of sleep."}</div>
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
