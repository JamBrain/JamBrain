import {h, Component} 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import UIButton							from 'com/ui/button/button';

import $ThemeIdeaVote					from 'shrub/js/theme/theme_idea_vote';
import $Node from 'shrub/js/node/node';

import PieChart							from 'com/visualization/piechart/piechart';

RECENT_CACHE_LENGTH = 50;
RECENT_CACHE_RENDER = 10;
VOTE_YES = 1;
VOTE_NO = 0;
VOTE_FLAG = -1;

// This sets shortest time between two votes and
// also controls the flash CSS effects, so you are
// to change this, also update the two animations in
// the CSS.
BETWEEN_VOTE_TIME = 500;

// The extra time the warning message is shown about
// having been too quick.
CALM_DOWN_MSG_TIME = 4000;

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
		this.hasWaited = this.hasWaited.bind(this);
		this.removeCalmDown = this.removeCalmDown.bind(this);
		this._renderMyIdea = this._renderMyIdea.bind(this);
	}

	componentDidMount() {
		this.hotKeyVote = this.hotKeyVote.bind(this);
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
			if (r.status === 200) {
				this.setState({"loggedIn": true});
				window.addEventListener('keyup', this.hotKeyVote);
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

	hotKeyVote( e ) {
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
		const {recent} = this.state;
		if ( recent.filter(voteId => voteId === id).length == 0 ) {
			recent.push(id);
		}

		while (this.state.recent.length > RECENT_CACHE_LENGTH) {
			const junk = this.state.recent.shift();
			console.log("trimmed", junk);
		}

		this.setState({'recent': recent});
	}

	renderIcon( value ) {
		if ( value === VOTE_YES )
			return <SVGIcon>checkmark</SVGIcon>;
		else if ( value === VOTE_NO )
			return <SVGIcon>cross</SVGIcon>;
		else if ( value === VOTE_FLAG )
			return <SVGIcon>flag</SVGIcon>;

		return <SVGIcon>fire</SVGIcon>;
	}

	renderRecentQueue() {
		const {flashRecent} = this.state;
		const End = this.state.recent.length;
		const Start = Math.max(0, End - RECENT_CACHE_RENDER);
		const ret = [];
		for ( let idx = End - 1; idx >= Start; idx -= 1) {			// Reverse Order
			const vote = this.state.votes[this.state.recent[idx]];
			const voteId = this.state.recent[idx];

			let VoteStyle = null;
			if ( vote === VOTE_YES ) {
				VoteStyle = '-yes';
			}
			else if ( vote === VOTE_NO ) {
				VoteStyle = '-no';
			}
			else if ( vote === VOTE_FLAG ) {
				VoteStyle = '-flag';
			}

			ret.push(
				<UIButton title={vote} class={cN('-recent', VoteStyle, flashRecent === voteId ? '-flash': null)} key={voteId} onclick={() => this.redoVote(voteId)}>
					{this.renderIcon(vote)}
					<span title={'Id: ' + voteId}>{this.state.ideas[voteId]}</span>
				</UIButton>
			);
		}
		return ret;
	}

	_submitVote( command ) {
		const {loggedIn} = this.state;
		if ( this.state.waitASecond ) {
			this.setState({'eagerVoter': "Take it easy, don't rush things!"});
			return;
		}

		this.setState({'waitASecond': true, 'flashButton': command, 'flashRecent': this.state.current, 'eagerVoter': null});
		setTimeout(this.hasWaited, BETWEEN_VOTE_TIME);
		return $ThemeIdeaVote[command](this.state.current)
		.then(r => {
			if ( r.status === 200 ) {
				this.state.votes[this.state.current] = r.value;
				this.addToRecentQueue(this.state.current);

				this.pickRandomIdea();
				if (!loggedIn) {
						this.setState({'loggedIn': false});
						window.addEventListener('keyup', this.hotKeyVote);
				}
			}
			else {
				location.href = "#expired";
				if (loggedIn) {
					window.removeEventListener('keyup', this.hotKeyVote);
					this.setState({'loggedIn': false});
				}
			}
		})
		.catch(err => {
			this.setState({'error': err});
		});
	}

	hasWaited() {
		this.setState({'waitASecond': false, 'flashButton': null, 'flashRecent': null});
		if ( this.state.eagerVoter ) {
			setTimeout(this.removeCalmDown, CALM_DOWN_MSG_TIME);
		}
	}

	removeCalmDown() {
		this.setState({'eagerVoter': null});
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
			'Slaughtered',
			'Kept',
			'Flagged',
			'Remaining',
		];

		const colors = [
			'no',
			'yes',
			'flag',
			'remaining',
		];

		const values = [
			0,
			0,
			0,
			state['votes-left'],
		];

		if ( seen != 0 ) {
			Object.values(state.votes).forEach((v) => {
				if ( v == VOTE_NO ) {
					values[0] += 1;
				}
				else if ( v == VOTE_YES ) {
					values[1] += 1;
				}
				else if ( v == VOTE_FLAG ) {
					values[2] += 1;
				}
			});
		}

		const StatsAndDetails = (
			<div class="stats-details">
				<div class="section -forty recent-votes">
					<h3>Recent Themes</h3>
					{this.renderRecentQueue()}
					<div class="-info">You can click on a previous vote to change it.</div>
				</div>
				<div class="section -sixty vote-graph">
					<h3>Vote distribution</h3>
					<PieChart values={values} labels={labels} colors={colors} />
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
			const ShowEager = state.eagerVoter ? <div class="-error">{state.eagerVoter}</div> : null;
			return (
				<div class="event-slaughter">
					<div class="-title">Would this be a good Theme?</div>
					<div class="-theme" onclick={this.openLink} title="Click to search Google for this">
						<div>{ThemeName}</div>
					</div>
					{ShowEager}
					<div class="-main-buttons">
						<UIButton class={cN("middle big -yes", state.flashButton == 'Yes' ? '-flash': null)} onclick={this.submitYesVote} title="Good" >{this.renderIcon(VOTE_YES)}<span><span class="hotkey">Y</span>ES</span></UIButton>
						<UIButton class={cN("middle big -no", state.flashButton == 'No' ? '-flash': null)} onclick={this.submitNoVote} title="Bad" >{this.renderIcon(VOTE_NO)}<span><span class="hotkey">N</span>O</span></UIButton>
					</div>
					<div class="-other-buttons">
						<div class="-title"><span>If inappropriate or offensive, you can </span><UIButton class="-flag" onclick={this.submitFlagVote}>{this.renderIcon(VOTE_FLAG)}<span>Flag</span></UIButton><span> it.</span></div>
						<div class="-info"><SVGIcon>info</SVGIcon><span> You can use <strong>Y</strong> and <strong>N</strong> as hotkeys.</span></div>
						<div><strong>Themes Slaughtered:</strong> <span>{Object.keys(state.votes).length}</span></div>
					</div>
					{StatsAndDetails}
				</div>
			);
		}
	}

	render( props, state ) {
		const {node, user} = props;
		const {loggedIn} = state;
		const Title = (<h3>Theme Slaughter Round</h3>);

		if ( node.slug && state.votes && state.ideas ) {
			if ( loggedIn && user && user['id'] ) {
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
						<div>{loggedIn == null ? 'Checking logged in status...' : 'Please log in (hotkeys may not activate immediately)'}</div>
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
