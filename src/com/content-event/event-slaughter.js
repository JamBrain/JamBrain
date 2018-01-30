import {h, Component} 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import UIButton							from 'com/ui/button/button';

import $ThemeIdeaVote					from 'shrub/js/theme/theme_idea_vote';

import PieChart							from 'com/visualization/piechart/piechart';

RECENT_CACHE_LENGTH = 50;
RECENT_CACHE_RENDER = 10;
VOTE_YES = 1;
VOTE_NO = 0;
VOTE_FLAG = -1;

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
		this.hotKeyVote = this.hotKeyVote.bind(this);
		window.addEventListener('keyup', this.hotKeyVote);
		const onVotes = $ThemeIdeaVote.GetMy(this.props.node.id)
		.then(r => {
			if ( r.votes ) {
				const End = this.state.recent.length;
				const Start = Math.max(0, End - RECENT_CACHE_LENGTH);

				// NOTE: The 'recent' order is quite random. Better than nothing though

				this.setState({'votes': r.votes, 'recent': Object.keys(r.votes).slice(Start).reverse()});
			}
			else {
				this.setState({'votes': []});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});

		const onIdeas = $ThemeIdeaVote.Get(this.props.node.id)
		.then(r => {
			if ( r.ideas ) {
				//console.log('get',r);
				this.setState({'ideas': r.ideas});
			}
			else {
				this.setState({'ideas': []});
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});

		// Once Finished
		Promise.all([onVotes, onIdeas])
		.then(r => {
			console.log("Loaded my Ideas and Themes", r);

			this.pickRandomIdea();
		})
		.catch(err => {
			console.log("Boo hoo", err);
		});
	}

	componentWillUnmount() {
		window.removeEventListener('keyup', this.hotKeyVote);
	}

	hotKeyVote( e, f, g ) {
		console.log(this, e, f, g);
		if ( e.keyCode == 89 ) {
			this._submitVote('Yes');
		}
		else if (e.keyCode == 78 ) {
			this._submitVote('No');
		}
	}

	pickRandomIdea() {
		if ( this.state.votes && this.state.ideas ) {
			const voteKeys = Object.keys(this.state.votes);
			const ideaKeys = Object.keys(this.state.ideas);

			const available = ideaKeys.filter(key => voteKeys.indexOf(key) === -1);

			if ( available.length === 0 ) {
				this.setState({'done': true, 'votes-left': available.length});
			}

			const id = parseInt(Math.random() * available.length);

			this.setState({'current': available[id], 'votes-left': available.length});
		}
		else {
			this.setState({'error': 'Not loaded'});
		}
	}

	redoVote(voteId) {
		this.setState({'current': voteId, 'done': false});
	}

	addToRecentQueue( id ) {
		let {recent} = this.state;
		recent = recent.filter(voteId => voteId !== id);
		recent.push(id);

		while (this.state.recent.length > RECENT_CACHE_LENGTH) {
			const junk = this.state.recent.shift();
			console.log("trimmed", junk);
		}

		this.setState({'recent': recent});
	}

	renderIcon( value ) {
		if ( value === VOTE_YES )
			return <span title={value} class="vote-icon"><SVGIcon>checkmark</SVGIcon></span>;
		else if ( value === VOTE_NO )
			return <span title={value} class="vote-icon"><SVGIcon>cross</SVGIcon></span>;
		else if ( value === VOTE_FLAG )
			return <span title={value} class="vote-icon"><SVGIcon>flag</SVGIcon></span>;

		return <span title={value} class="vote-icon"><SVGIcon>fire</SVGIcon></span>;
	}

	renderRecentQueue() {
		// Render the last 10
		const End = this.state.recent.length;
		const Start = Math.max(0, End - RECENT_CACHE_RENDER);
		const ret = [];
		for ( let idx = End - 1; idx >= Start; idx -= 1) {			// Reverse Order
			const vote = this.state.votes[this.state.recent[idx]];
			const voteId = this.state.recent[idx];

			let VoteStyle = null;
			if ( vote === VOTE_YES ) {
				VoteStyle = '-green';
			}
			else if ( vote === VOTE_NO ) {
				VoteStyle = '-red';
			}
			else if ( vote === VOTE_FLAG ) {
				VoteStyle = '-flag';
			}

			ret.push(
				<UIButton class={cN('-recent', VoteStyle)} key={voteId} onclick={() => this.redoVote(voteId)}>
					{this.renderIcon(vote)}
					<span title={'Id: ' + voteId}>{this.state.ideas[voteId]}</span>
				</UIButton>
			);
		}
		return ret;
	}

	_submitVote( command ) {
		return $ThemeIdeaVote[command](this.state.current)
		.then(r => {
			if ( r.status === 200 ) {
				this.state.votes[this.state.current] = r.value;
				this.addToRecentQueue(this.state.current);

				this.pickRandomIdea();
			}
			else {
				location.href = "#expired";
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	submitYesVote( e ) {
		return this._submitVote('Yes');
	}
	submitNoVote( e ) {
		return this._submitVote('No');
	}
	submitFlagVote( e ) {
		return this._submitVote('Flag');
	}

	openLink( e ) {
		// Google link https://www.google.com/search?q=[query]
		const url = "https://www.google.com/search?q="+encodeURIComponent(this.state.ideas[this.state.current]);
		const win = window.open(url, '_blank');
		win.focus();
	}

	_renderMyIdea( id ) {
		const idea = escape(this.state.ideas[id]);

		return (
			<div class="-item">
				<div class="-text" title={idea}>{idea}</div>
			</div>
		);
	}

	renderMyIdeas() {
		return Object.keys(this.state.ideas).map(this._renderMyIdea);
	}

	renderBody( state ) {

		const seen = Object.keys(state.votes).length;

		const labels = [
			'slaughtered',
			'kept',
			'left'
		];

		const values = [
			0,
			0,
			state['votes-left']
		];

		if ( seen != 0 ) {
			Object.values(state.votes).forEach((v) => {
				if ( v == 0 ) {
					values[0]++;
				}
				else if ( v == 1 ) {
					values[1]++;
				}
				// else if v=2 it's flagged
			});
		}

		const StatsAndDetails = (
			<div class="stats-details">
				<div class="section -forty recent-votes">
					<h3>Recent Themes</h3>
					{this.renderRecentQueue()}
				</div>
				<div class="section -sixty vote-graph">
					<h3>Vote distribution</h3>
					<PieChart values={values} labels={labels} />
				</div>
			</div>
		);

		if ( state.done ) {
			return (
				<div class="event-slaughter">
					<div class="-title">Wow! You're totally done! Amazing!</div>
					<div class="-title">You slaughtered {Object.keys(state.votes).length} themes!</div>
					{StatsAndDetails}
				</div>
			);
		}
		else if ( state.current ) {
			const ThemeName = (state.ideas[state.current]);
			return (
				<div class="event-slaughter">
					<div class="-title">Would this be a good Theme?</div>
					<div class="-theme" onclick={this.openLink} title="Click to search Google for this">
						<div>{ThemeName}</div>
					</div>
					<div class="-buttons">
						<UIButton class="middle big -green" onclick={this.submitYesVote} title="Good">(Y)ES {this.renderIcon(VOTE_YES)}</UIButton>
						<UIButton class="middle big -red" onclick={this.submitNoVote} title="Bad">(N)O {this.renderIcon(VOTE_NO)}</UIButton>

						<div class="-title">If inappropriate or offensive, you can <UIButton class="-flag" onclick={this.submitFlagVote}>Flag {this.renderIcon(VOTE_FLAG)}</UIButton> it.</div>
						<div>You may use hotkeys <b>Y</b> for yes and <b>N</b> for no votes.</div>
					</div>
					<div class="-stats">
						<div>
							<strong>Themes Slaughtered:</strong> <span>{Object.keys(state.votes).length}</span>
						</div>
						{StatsAndDetails}
					</div>
				</div>
			);
		}
	}

	render( props, state ) {
		const {node, user} = props;
		const Title = (<h3>Theme Slaughter Round</h3>);

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
					{ state.error ? state.error : <NavSpinner /> }
				</div>
			);
		}
	}
}
