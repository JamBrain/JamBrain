import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';
import NavSpinner						from 'com/nav-spinner/spinner';

import ButtonBase						from 'com/button-base/base';

import $ThemeList						from '../../shrub/js/theme/theme_list';
import $ThemeListVote					from '../../shrub/js/theme/theme_list_vote';


export default class ContentEventList extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'lists': null,
			'names': null,
			'votes': null,
			'page': 1
		}
		
		this.renderList = this.renderList.bind(this);
	}
	
	componentDidMount() {
		$ThemeList.Get(this.props.node.id)
		.then(r => {
			if ( r.lists ) {
				var newstate = { 
					'lists': r.lists, 
					'names': r.names
				};
				if ( r.allowed.length > 0 ) {
					newstate['page'] = r.allowed[r.allowed.length-1];
				}
				
				this.setState(newstate);
			}
			else {
				this.setState({ 'lists': null });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});

		$ThemeListVote.GetMy(this.props.node.id)
		.then(r => {
			if ( r.votes ) {
				this.setState({ 'votes': r.votes });
			}
			else {
				this.setState({ 'votes': null });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}
	
	addToVotes( id, value ) {
		var votes = Object.assign({}, this.state.votes);
		votes[id] = value;
		this.setState({ 'votes': votes });
	}
	
	_submitVote( command, id, e ) {
		return $ThemeListVote[command](id)
		.then(r => {
			if ( r.status === 200 ) {
				this.addToVotes(r.id, r.value);
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
	
	voteToClass( vote ) {
		if ( vote === 1 )
			return ' -yes';
		else if ( vote === 0 )
			return ' -maybe';
		else if ( vote === -1 )
			return ' -no';
		return '';
	}
	
	renderList( list ) {
		if ( this.state.lists[list] ) {
			var ThemeMode = Number.parseInt(this.props.node.meta['theme-page-mode-'+list]);
			if ( this.state.votes && ThemeMode === 1 ) {
				var _class = "theme-item";
				
				var ShowHeadline = null;
				
				return (
					<div class="theme-list">
						<h3>{this.state.names[list]}</h3>
						{this.state.lists[list].map(r => {
							return <div class={_class + this.voteToClass(this.state.votes[r.id])}>
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
			else if ( ThemeMode === 2 ) {
				return [
					<h3>{this.state.names[list]}</h3>,
					"This round has ended.",
					<br />,
					this.state.lists[list].map(r => {
						return <div>{r.theme}</div>;
					})
				];				
			}
			else {
				return [
					<h3>{this.state.names[list]}</h3>,
					this.state.lists[list].map(r => {
						return <div>{r.theme}</div>;
					})
				];
			}
		}
		else if ( this.state.names[list] ) {
			return [
				<h3>{this.state.names[list]}</h3>,
				"This round hasn't started yet. Say tuned!"
			];
		}
		return null;
	}
	
	render( {/*node,*/ user, path, extra}, {lists, names, votes, page, error} ) {
		var Title = <h3>Theme Voting Round</h3>;
	
		// By default, the page is the last available round	
		if ( (extra && extra.length && extra[0]) ) {
			page = Number.parseInt(extra[0]);
		}
		
		var Navigation = null;
		if ( names ) {
			Navigation = (
				<div class="event-nav">
					{Object.keys(names).map(v => <NavLink class={"-item" + ((v == page) ? " -selected" : "")} href={path+'/'+v}>{names[v]}</NavLink>)}
				</div>
			);
		}

		// Page bodies		
		var Body = null;
		if ( user && user['id'] && lists && votes ) {
			Body = page ? this.renderList(page) : null;
		}
		else if ( lists ) {
			Body = [
				<div class="-info">Please log in</div>,
				page ? this.renderList(page) : null
			];
		}
		else if ( error ) {
			Body = <div>{error}</div>;
		}
		else {
			Body = <NavSpinner />;
		}

		// Generate the page		
		return (
			<div class="-body">
				{Title}
				{Navigation}
				{Body}
			</div>
		);
	}
}
