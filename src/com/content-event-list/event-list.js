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
		if ( this.state.lists[list] ) {
			return (
				<div>
					<h3>{this.state.names[list]}</h3>
					{this.state.lists[list].map(r => {
						return <div>{r.theme}</div>;
					})}
				</div>
			);
		}
		else if ( this.state.names[list] ) {
			return (
				<div>
					<h3>{this.state.names[list]}</h3>
					{"This round hasn't started yet. Say tuned!"}
				</div>
			);			
		}
		return null;
	}
	
	render( {node, user, path, extra}, {lists, error} ) {
		var Title = <h3>Theme Voting Round</h3>;
		
		var page = 1;
		if ( (extra && extra.length && extra[0]) ) {
			page = Number.parseInt(extra[0]);
		}
		
		if ( user && user['id'] && lists ) {
			return (
				<div class="-body">
					{Title}
					<div class="_hidden">Round begins soon...</div>
					{page ? this.renderList(page) : null}
					<br />
					<div>{"(Sorry! Voting isn't ready yet, but here's 1st round list)"}</div>
				</div>
			);
		}
		else if ( lists ) {
			return (
				<div class="-body">
					{Title}
					<div class="_hidden">Please log in</div>
					{page ? this.renderList(page) : null}
					<br />
					<div>{"(Sorry! Voting isn't ready yet, but here's 1st round list)"}</div>
				</div>
			);
		}
		else {
			return (
				<div class="-body">
					{Title}
					<div>Problem</div>
				</div>
			);
		}
	}
}
