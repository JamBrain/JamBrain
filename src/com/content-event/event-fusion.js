import {h, Component}					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ButtonBase						from 'com/button-base/base';

import $ThemeIdea						from '../../shrub/js/theme/theme_idea';


export default class ContentEventFusion extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			'ideas': {},
			'fusionSeeds': [],
			'ideasPerGroup': 6,
			'fused': {},
			'defused': {},
		};
	}

	componentDidMount() {
		$ThemeIdeaVote.Get(this.props.node.id)
			.then(r => {
				if ( r.ideas ) {
					this.setState({'ideas': r.ideas});
					this.getGroup();
				}
				else {
					this.setState({'ideas': []});
				}
			})
			.catch(err => {
				this.setState({'error': err});
			});

	}

	getRandomSeed() {
		const {fusionSeeds, ideas} = this.state;
		const ideaIds = Object.keys(ideas).filter(i => fusionSeeds.indexOf(i) === -1);
		if (ideaIds.length == 0) {
			return null;
		}
		const index = parseInt(Math.random() * available.length);
		return ideaIds[index];
	}

	getLongestCommonSubsequenceLength( A, B ) {
		return 0;
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
		for ( let i = 1; i < group.length; i += 1 ){
			console.log(i, scores[group[i]], ideas[group[i]]);
		}
	}

	getGroup() {
		const {ideas, ideasPerGroup} = this.state;
		const seedId = getRandomSeed();
		const scores = {};
		if (seedId == null) {
			return [];
		}
		const seed = ideas[seedId];
		const ideaIds = Object.keys(ideas);
		for (let idx = 0; idx < ideaIds.length; i+= 1) {
			const curId = ideaIds[idx];
			if (curId == seedId) {
				continue;
			}
			scores[curId] = this.getLongestCommonSubsequenceLength(seed, ideas[curId]);
		}

		const best = ideaIds.sort((a, b) => scores[b] - scores[a]);
		const group = [seed].concat(best.slice(0, ideasPerGroup - 1));
		this.reportOnGroup(group, scores, ideas);
		return this.fisherYatesShuffle(group);
	}

	render( props, state ) {
		const {user} = props;
		const Title = <h3>Theme Fusion Round</h3>;
		if ( user && user.id ) {
			return (
				<div class="-body">
					{Title}
					<div>
						If any, mark the ones below that should be fused. You should only mark one group per set. Most of  the sets you will probably not find anything to fuse. This is expected and normal.
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
