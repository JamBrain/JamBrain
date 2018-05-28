import {h, Component}					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import UIButton							from 'com/ui/button/button';

import $ThemeIdeaVote					from '../../shrub/js/theme/theme_idea_vote';


export default class ContentEventFusion extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			'ideas': {},
			'fusionSeeds': [],
			'ideasPerGroup': 8,
			'inclusionThreshold': 0.4,
			'selected': [],
			'ideaCount': 1,
			'noFuses': {},
		};

		this.handleFuseFiss = this.handleFuseFiss.bind(this);
	}

	componentDidMount() {
		$ThemeIdeaVote.Get(this.props.node.id)
			.then(r => {
				if ( r.ideas ) {
					this.setState({
						'ideas': r.ideas,
						'ideaCount': Object.keys(r.ideas).length,
					});
					this.getGroup(r.ideas);
				}
				else {
					this.setState({'ideas': []});
				}
			})
			.catch(err => {
				this.setState({'error': err});
			});

	}

	handleToggleIdea(ideaId) {
		const {selected} = this.state;
		if ( selected.indexOf(ideaId) === -1 ) {
			this.setState({'selected': [ideaId].concat(selected)});
		}
		else {
			this.setState({'selected': selected.filter(selectedId => selectedId !== ideaId)});
		}
	}

	updateNoFuses() {
		const {selected, group, noFuses, fusionSeeds} = this.state;
		const notSelected = selected.filter(i => selected.indexOf(i) === -1);
		const futureNotSelected = notSelected.filter(i => fusionSeeds.indexOf(i) === -1);
		if ( selected.length === 0 ) {
			// You said non were similar to the other so will exclude
			// all pairwise in future.
			futureNotSelected.forEach(i => {
				const prevNoFuses = noFuses[i];
				if ( prevNoFuses ) {
					noFuses[i] = prevNoFuses.concat(notSelected.filter(j => prevNoFuses.indexOf(j) === -1));
				}
				else {
					noFuses[i] = notSelected;
				}
			});
		}
		else {
			// You said these don't merge with the one's you selected.
			// So you won't be asked about that again.
			futureNotSelected.forEach(i => {
				const prevNoFuses = noFuses[i];
				if ( prevNoFuses ) {
					noFuses[i] = prevNoFuses.concat(selected.filter(j => prevNoFuses.indexOf(j) === -1));
				}
				else {
					noFuses[i] = selected;
				}
			});
		}
		this.setState({'noFuses': noFuses});
	}

	handleFuseFiss() {
		const {selected, group, ideas} = this.state;
		const doFuse = (selected.length > 1);
		if ( doFuse ) {
			console.log('FUSE', selected.map(ideaId => ideas[ideaId]));
			this.updateNoFuses();
		}
		else if ( selected.length === 0 ) {
			console.log('NO FUSION', group.map(ideaId => ideas[ideaId]));
			this.updateNoFuses();
		}
		else {
			console.log("TODO: Disable selecting only one");
		}
		this.getGroup(ideas);
	}

	getRandomSeed(ideas) {
		const {fusionSeeds} = this.state;
		const ideaIds = Object.keys(ideas).filter(i => fusionSeeds.indexOf(i) === -1);
		if (ideaIds.length === 0) {
			return null;
		}
		const index = parseInt(Math.random() * ideaIds.length);
		return ideaIds[index];
	}

	getLongestCommonSubsequence( a, b ) {
		// Adapted form from
		// https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Longest_common_subsequence#JavaScript
		const m = a.length;
		const n = b.length;
		const C = [];
		for ( let i = 0; i <= m; i += 1 ) {
			C.push([0]);
		}
		for ( let j = 0; j < n; j += 1 ) {
			C[0].push(0);
		}
		for ( let i = 0; i < m; i += 1 ) {
			for ( let j = 0; j < n; j += 1 ) {
				C[i + 1][j + 1] = a[i] === b[j] ? (C[i][j] + 1) : Math.max(C[i + 1][j], C[i][j + 1]);
			}
		}
		const bt = (i, j) => {
			if ( i * j === 0 ) {
				return "";
			}
			else if ( a[i - 1] === b[j - 1]) {
				return bt(i - 1, j - 1) + a[i - 1];
			}
			else {
				return (C[i][j - 1] > C[i - 1][j]) ? bt(i, j - 1) : bt(i - 1, j);
			}
		};
		return bt(m, n);
	}

	fisherYatesShuffle( arr ) {
		let counter = arr.length;
		while ( counter > 0 ) {
			const idx = Math.floor(Math.random() * counter);
			counter -= 1;
			const tmp = arr[counter];
			arr[counter] = arr[idx];
			arr[idx] = tmp;
		}
		return arr;
	}

	reportOnGroup( group, scores, ideas ) {
		console.log('SEED:', ideas[group[0]]);
		for ( let i = 1; i < group.length; i += 1 ) {
			console.log(i, scores[group[i]], ideas[group[i]]);
		}
	}

	getGroup(ideas) {
		const {ideasPerGroup, inclusionThreshold, fusionSeeds, noFuses} = this.state;
		const seedId = this.getRandomSeed(ideas);
		if (seedId == null) {
			return [];
		}
		const scores = {};
		const seed = ideas[seedId];
		const seedLength = seed.length;
		const ideaNoFuse = noFuses[seed] ? noFuses[seed] : [];
		const ideaIds = Object.keys(ideas).filter(ideaId => ((ideaId !== seedId) && (ideaNoFuse.indexOf(ideaId) === -1)));
		for (let idx = 0; idx < ideaIds.length; idx+= 1) {
			const curId = ideaIds[idx];
			const cur = ideas[curId];
			if (curId == seedId) {
				continue;
			}
			let score = this.getLongestCommonSubsequence(seed, cur).length;
			// Geometric mean of overlap fractions
			scores[curId] = Math.sqrt((score / seedLength) * (score / cur.length));
		}
		const best = ideaIds.sort((a, b) => scores[b] - scores[a]).filter(ideaId => scores[ideaId] > inclusionThreshold);
		const group = [seedId].concat(best.slice(0, ideasPerGroup - 1));
		this.reportOnGroup(group, scores, ideas);
		fusionSeeds.push(seedId);
		this.setState({
			'group': this.fisherYatesShuffle(group),
			'selected': [],
			'fusionSeeds': fusionSeeds,
		});
	}

	render( props, state ) {
		const {user} = props;
		const {group, ideas, selected, fusionSeeds, ideaCount} = state;
		const Title = <h3>Theme Fusion Round</h3>;
		if ( user && user.id ) {
			let ShowGroup = null;
			if (group) {

				// Ideas to fuse or not.
				const Ideas = group.map(ideaId => <UIButton class={cN('-idea', selected.indexOf(ideaId) > -1 ? '-selected' : null)} key={ideaId} onclick={this.handleToggleIdea.bind(this, ideaId)}>{ideas[ideaId]}</UIButton>);

				// The action button.
				let ActionText = null;
				let actionButtonClass = null;
				let actionDisabled = null;
				if ( selected.length === 0) {
					ActionText = 'NO FUSE';
					actionButtonClass = '-fiss';
				}
				else if ( selected.length === 1 ) {
					ActionText = 'NEED ZERO OR 2+ SELECTED';
					actionButtonClass = '-disabled';
					actionDisabled = 'disabled';
				}
				else {
					ActionText = 'FUSE';
					actionButtonClass = '-fuse';
				}

				// Minus one because you're not done with it yet.
				const progress = parseInt((fusionSeeds.length - 1) / ideaCount * 100);

				ShowGroup = (
					<div class="fusion-box">
						<div class="-progress">{progress}% evaluated</div>
						<div class="-ideas">{Ideas}</div>
						<div class="-button-box">
							<UIButton onclick={this.handleFuseFiss} class={cN('fuse-fiss', actionButtonClass)} disabled={actionDisabled}>{ActionText}</UIButton>
						</div>
					</div>
				);
			}

			return (
				<div class="-body event-fusion">
					{Title}
					<div class="-warning">This is just a prototype and will not actually have any effect if you fuse or say things shouldn't be fused.</div>
					{ShowGroup}
					<div class="-instructions">
						If any, mark the ones that should be fused.
						You should only mark one group per set.
						Most of  the sets you will probably not find anything to fuse.
						In this case you are voting for them not to be fused.
						When you select two or more and say 'FUSE',
						you are suggesting that the themes are so similar
						that they are practically identical and can be
						concidered one and the same.
					</div>
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
