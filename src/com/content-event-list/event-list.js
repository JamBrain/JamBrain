import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeList						from '../../shrub/js/theme/theme_list';
import $ThemeListVote					from '../../shrub/js/theme/theme_list_vote';


export default class ContentEventList extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'lists': null,
			'names': null,
			'votes': null
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

		$ThemeListVote.GetMy(this.props.node.id)
		.then(r => {
			if ( r.lists ) {
				this.setState({ 'votes': r.votes });
			}
			else {
				this.setState({ 'votes': [] });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}
	
	_submitVote( command, id, e ) {
		return $ThemeListVote[command](id)
		.then(r => {
			if ( r.status === 200 ) {
//				this.state.votes[this.state.current] = r.value;
//				this.addToRecentQueue(this.state.current);
//				
//				this.pickRandomIdea();
			}
			else {
				location.href = "#expired";
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}
	
	onYes( id, e ) {
		return this._submitVote('Yes', id, e);
	}
	onMaybe( id, e ) {
		return this._submitVote('Maybe', id, e);
	}
	onNo( id, e ) {
		return this._submitVote('No', id, e);
	}
	
	renderList( list ) {
		if ( this.state.lists[list] ) {
			if ( Number.parseInt(this.props.node.meta['theme-page-mode-'+list]) === 1 ) {
				var _class = "theme-item";
				_class += " -yes";
				
				return (
					<div class="theme-list">
						<h3>{this.state.names[list]}</h3>
						{this.state.lists[list].map(r => {
							return <div class={_class}>
								<ButtonBase class="-button -yes" onClick={this.onYes.bind(this, r.id)}>+1</ButtonBase>
								<ButtonBase class="-button -maybe" onClick={this.onMaybe.bind(this, r.id)}>0</ButtonBase>
								<ButtonBase class="-button -no" onClick={this.onNo.bind(this, r.id)}>-1</ButtonBase>
								<span class="-text">{r.theme}</span>
							</div>;
						})}
						<div class="-tip">
							<strong>NOTE:</strong>{" Votes are sent automatically. When the color changes, they have been accepted."}
						</div>
					</div>
				);
			}
			else {
				return (
					<div>
						<h3>{this.state.names[list]}</h3>
						{this.state.lists[list].map(r => {
							return <div>{r.theme}</div>;
						})}
					</div>
				);
			}
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
					{page ? this.renderList(page) : null}
				</div>
			);
		}
		else if ( lists ) {
			return (
				<div class="-body">
					{Title}
					<div class="">Please log in</div>
					{page ? this.renderList(page) : null}
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
