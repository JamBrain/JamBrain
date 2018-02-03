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
			'ideasPerGroup': 12,
			'fused': {},
			'defused': {},
			'selected': [],
		};

		this.handleFuseFiss = this.handleFuseFiss.bind(this);
	}

	componentDidMount() {
		$ThemeIdeaVote.Get(this.props.node.id)
			.then(r => {
				if ( r.ideas ) {
					this.setState({'ideas': r.ideas});
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

	handleFuseFiss() {
		const {selected, group, ideas} = this.state;
		const doFuse = (selected.length > 1);
		if ( doFuse ) {
			console.log('FUSE', selected.map(ideaId => ideas[ideaId]));
		}
		else if ( selected.length === 0 ) {
			console.log('FISSion', group.map(ideaId => ideas[ideaId]));
		}
		else {
			console.log("TODO: Disable selecting only one");
		}
		this.getGroup(ideas);
	}

	getRandomSeed(ideas) {
		const {fusionSeeds} = this.state;
		const ideaIds = Object.keys(ideas).filter(i => fusionSeeds.indexOf(i) === -1);
		//console.log(fusionSeeds, Object.keys(ideas));
		if (ideaIds.length === 0) {
			return null;
		}
		const index = parseInt(Math.random() * ideaIds.length);
		return ideaIds[index];
	}

	getLongestCommonSubsequenceLength( a, b ) {
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
			console.log(i, scores[group[i]].length, scores[group[i]], ideas[group[i]]);
		}
	}

	getGroup(ideas) {
		const {ideasPerGroup} = this.state;
		const seedId = this.getRandomSeed(ideas);
		if (seedId == null) {
			return [];
		}
		const scores = {};
		const seed = ideas[seedId];
		const ideaIds = Object.keys(ideas).filter(ideaId => ideaId !== seedId);
		for (let idx = 0; idx < ideaIds.length; idx+= 1) {
			const curId = ideaIds[idx];
			if (curId == seedId) {
				continue;
			}
			scores[curId] = this.getLongestCommonSubsequenceLength(seed, ideas[curId]);
		}
		const best = ideaIds.sort((a, b) => scores[b].length - scores[a].length);
		const group = [seedId].concat(best.slice(0, ideasPerGroup - 1));
		this.reportOnGroup(group, scores, ideas);
		this.setState({'group': this.fisherYatesShuffle(group), 'selected': []});
	}

	render( props, state ) {
		const {user} = props;
		const {group, ideas, selected} = state;
		const Title = <h3>Theme Fusion Round</h3>;
		if ( user && user.id ) {
			let ShowGroup = null;
			if (group) {
				const Ideas = group.map(ideaId => <UIButton class={cN('-idea', selected.indexOf(ideaId) > -1 ? '-selected' : null)} key={ideaId} onclick={this.handleToggleIdea.bind(this, ideaId)}>{ideas[ideaId]}</UIButton>);
				ShowGroup = (
					<div class="fusion-box">
						<div class="-ideas">{Ideas}</div>
						<UIButton onclick={this.handleFuseFiss}>Fuse</UIButton>
					</div>
				);
			}

			return (
				<div class="-body event-fusion">
					{Title}
					<div class="-warning">This is just a prototype and will not actually have any effect if you fuse or 'fiss'</div>
					<div>
						If any, mark the ones below that should be fused. You should only mark one group per set. Most of  the sets you will probably not find anything to fuse. This is expected and normal.
					</div>
					{ShowGroup}
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
