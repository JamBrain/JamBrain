import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeIdeaVote					from '../../shrub/js/theme/theme_idea_vote';


export default class ContentEventSlaughter extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'current': null,
			'votes-left': null,
			'recent': [],
			
			'votes': null,
			'ideas': null
		};
				
		this.submitYesVote = this.submitYesVote.bind(this);
		this.submitNoVote = this.submitNoVote.bind(this);
		this.submitFlagVote = this.submitFlagVote.bind(this);

		this._renderMyIdea = this._renderMyIdea.bind(this);
	}
	
	componentDidMount() {
		var onVotes = $ThemeIdeaVote.GetMy(this.props.node.id)
		.then(r => {
			if ( r.votes ) {
				//console.log('my',r);
				this.setState({ 'votes': r.votes });
			}
			else {
				this.setState({ 'votes': [] });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
		
		var onIdeas = $ThemeIdeaVote.Get(this.props.node.id)
		.then(r => {
			if ( r.ideas ) {
				//console.log('get',r);
				this.setState({ 'ideas': r.ideas });
			}
			else {
				this.setState({ 'ideas': [] });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
		
		// Once Finished
		Promise.all([ onVotes, onIdeas ])
		.then(r => {
			console.log("Loaded my Ideas and Themes", r);
			
			this.pickRandomIdea();
		})
		.catch(err => {
			console.log("Boo hoo", err);
		});
	}
	
	pickRandomIdea() {
		if ( this.state.votes && this.state.ideas ) {
			var vote_keys = Object.keys(this.state.votes);
			var idea_keys = Object.keys(this.state.ideas);
			
			var available = idea_keys.filter(key => vote_keys.indexOf(key) === -1);
						
			if ( available.length === 0 ) {
				this.setState({ 'done': true, 'votes-left': available.length });
			}

			var id = parseInt(Math.random() * available.length);
	
			this.setState({ 'current': available[id], 'votes-left': available.length });
		}
		else {
			this.setState({ 'error': 'Not loaded' });
		}
	}
	
	addToRecentQueue( id ) {
		this.state.recent.push(id);
		
		while (this.state.recent.length > 3) {
			var junk = this.state.recent.shift();
			console.log("trimmed",junk);
		}
		
		this.setState({ 'recent': this.state.recent });
	}
	
	renderRecentQueue() {
		// Render the last 10
		var End = this.state.recent.length;
		var Start = End - 4;
		if ( Start < 0 )
			Start = 0;
		
		var ret = [];
//		for ( var idx = Start; idx < End; idx++ ) {
		for ( var idx = End; idx-- > Start; ) {
			ret.push(
				<div>{this.state.ideas[this.state.recent[idx]]}</div>
			);
		}
		return ret;
	}

//	commandToScore( command ) {
//		if ( command === 'Yes' )
//			return 1;
//		else if ( command === 'No' )
//			return 0;
//		else if ( command === 'Flag' )
//			return -1;
//		
//		return 0;
//	}
	
	_submitVote( command, e ) {
		return $ThemeIdeaVote[command](this.state.current)
		.then(r => {
			this.state.votes[this.state.current] = r.value;// this.commandToScore(command);
			this.addToRecentQueue(this.state.current);
//			console.log(r);
			
			this.pickRandomIdea();
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}
	submitYesVote( e ) {
		return this._submitVote('Yes', e);
	}
	submitNoVote( e ) {
		return this._submitVote('No', e);
	}
	submitFlagVote( e ) {
		return this._submitVote('Flag', e);
	}

	_renderMyIdea( id ) {
		var idea = this.state.ideas[id];
		
		return (
			<div class="-item">
				<div class='-text' title={idea}>{idea}</div>
			</div>
		);
	}
	renderMyIdeas() {
		return Object.keys(this.state.ideas).map(this._renderMyIdea);
	}
	
	renderBody( {current, votes, ideas, done, error} ) {
		if ( done ) {
			return (
				<div>
					<div>Wow! {"You're totally done!"} Amazing! You slaughtered {Object.keys(votes).length} themes!</div>
					<br />
					{this.renderRecentQueue()}
				</div>
			);
		}
		else if ( current ) {
			var ThemeName = ideas[current];
			return (
				<div>
					<div class="title big">Would this be a good Theme?</div>
					<div class="kill-group" id="kill-theme-border" onclick="OpenLink()" title="Click to search Google for this">
						<div class="bigger" id="kill-theme">{ThemeName}</div>
					</div>
					<div class="kill-buttons">
						<button id="kill-good" class="middle big green_button" onclick={this.submitYesVote} title='Good'>YES ✓</button>
						<button id="kill-bad" class="middle big red_button" onclick={this.submitNoVote} title='Bad'>NO ✕</button>
						
						<div class="title">If inappropriate or offensive, <button onclick={this.submitFlagVote}>click here to Flag ⚑</button></div>
					</div>		
					<br />
					{this.renderRecentQueue()}
				</div>
			);
		}		
	}

	render( {node, user, path, extra}, state ) {
		var Title = (<h3>Theme Slaughter Round</h3>);
		
		if ( node.slug && state.votes && state.ideas ) {
			if ( user && user['id'] ) {
				return (
					<div class="-body">
						{Title}
						{this.renderBody(state)}
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
		else {
			return (
				<div class="content-base content-post">
					{ state.error ? state.error : "Please Wait..." }
				</div>
			);
		}
	}
}


//							<h3>My Suggestions</h3>
//							<div class="idea-mylist">
//								{ this.renderMyIdeas() }
//							</div>

