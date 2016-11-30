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

		this.openLink = this.openLink.bind(this);

		this._renderMyIdea = this._renderMyIdea.bind(this);
	}
	
	componentDidMount() {
		var onVotes = $ThemeIdeaVote.GetMy(this.props.node.id)
		.then(r => {
			if ( r.votes ) {
				var End = this.state.recent.length;
				var Start = End - 50;
				if ( Start < 0 )
					Start = 0;
				
				// NOTE: The 'recent' order is quite random. Better than nothing though
				
				this.setState({ 'votes': r.votes, 'recent': Object.keys(r.votes).slice(Start).reverse() });
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
		
		while (this.state.recent.length > 50) {
			var junk = this.state.recent.shift();
			console.log("trimmed",junk);
		}
		
		this.setState({ 'recent': this.state.recent });
	}
	
	renderIcon( value ) {
		if ( value === 1 )
			return <SVGIcon>checkmark</SVGIcon>;
		else if ( value === 0 )
			return <SVGIcon>cross</SVGIcon>;
		else if ( value === -1 )
			return <SVGIcon>flag</SVGIcon>;
		
		return <SVGIcon>fire</SVGIcon>;
	}
	
	renderRecentQueue() {
		// Render the last 10
		var End = this.state.recent.length;
		var Start = End - 10;
		if ( Start < 0 )
			Start = 0;
		
		var ret = [];
//		for ( var idx = Start; idx < End; idx++ ) {		// Regular Order
		for ( var idx = End; idx-- > Start; ) {			// Reverse Order
			ret.push(
				<div>
					{this.renderIcon(this.state.votes[this.state.recent[idx]])}
					<span>{this.state.ideas[this.state.recent[idx]]}</span>
				</div>
			);
		}
		return ret;
	}
	
	_submitVote( command, e ) {
		return $ThemeIdeaVote[command](this.state.current)
		.then(r => {
			this.state.votes[this.state.current] = r.value;
			this.addToRecentQueue(this.state.current);
			
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
	
	openLink( e ) {
		// TODO: this
		console.log("link open omg");
	}

	_renderMyIdea( id ) {
		var idea = escape(this.state.ideas[id]);
		
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
		var StatsAndDetails = (
			<div>
				<h3>Recent Themes</h3>
				{this.renderRecentQueue()}
			</div>			
		);
		
		if ( done ) {
			return (
				<div>
					<div>Wow! {"You're totally done!"} Amazing! You slaughtered {Object.keys(votes).length} themes!</div>
					{StatsAndDetails}
				</div>
			);
		}
		else if ( current ) {
			var ThemeName = (ideas[current]);
			return (
				<div class="event-slaughter">
					<div class="-title">Would this be a good Theme?</div>
					<div class="-theme" onclick={this.openLink} title="Click to search Google for this">
						<div>{ThemeName}</div>
					</div>
					<div class="-buttons">
						<button class="middle big -green" onclick={this.submitYesVote} title='Good'>YES ✓</button>
						<button class="middle big -red" onclick={this.submitNoVote} title='Bad'>NO ✕</button>
						
						<div class="-title">If inappropriate or offensive, you can <button class="-tiny" onclick={this.submitFlagVote}>Flag ⚑</button> it.</div>
					</div>
					<div class="-stats">
						<div>
							<strong>Themes Slaughtered:</strong> <span>{Object.keys(votes).length}</span>
						</div>
						{StatsAndDetails}
					</div>
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
