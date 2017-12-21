import {h, Component} from 'preact/preact';

import ContentSimple					from 'com/content-simple/simple';

import ContentList				from 'com/content-list/list';
import ContentLoading			from 'com/content-loading/loading';

import UIButtonLink from 'com/ui/button/button-link';

import $Grade					from 'shrub/js/grade/grade';
import $Node					from 'shrub/js/node/node';

export default class MyGrades extends Component {

	constructor( props ) {
		super(props);
		this.state = {
			'loading': true,
		};
	}
	componentDidMount() {
		$Grade.GetMyList(this.props.node.id)
			.then(r => {
				this.setState({'gameIds': r.items, 'nodes': new Map(), 'loading': true, 'error': null});
				this.collectNodes(r.items);
			})
			.catch(r => {
				this.setState({'error': r, 'gameIds': null, 'loading': false});
			});
	}

	collectNodes( gameIds ) {
		let promises = [];
		let mapping = new Map();
		const chunkSize = 20;
		for (let i = 0; i < gameIds.length; i += chunkSize) {
			promises.push($Node.Get(gameIds.slice(i, i + chunkSize))
				.then(r => {
					r.node.map(node => {
						mapping[node.id] = node;
					});
				})
				.catch(r => {
					this.setState({'error': r});
				})
			);
		}

		Promise.all(promises)
			.then(r => {
				this.setState({'loading': false, 'nodes': mapping});
			});
	}

    render( props, state ) {
		const {gameIds, error, nodes, loading} = state;
		const shouldGradeNoGames = 20;
		const hasResults = !loading && !error;
		const ShowError = error ? <div class="-warning">Could not retrieve your votes. Are you logged in?</div> : null;

		let ShowLoading = !gameIds && !error ? <ContentLoading /> : null;
		let ShowParagraph = null;
		let ShowWarning = null;

		if (!!gameIds) {
			if (gameIds.length < shouldGradeNoGames) {
				ShowWarning = (
					<div class="-warning">
						To fully participate in Ludum Dare you need to play and grade others' games.
						You should aim at playing at least {shouldGradeNoGames} games.
						Doing so will also ensure that when the event is over, your game will be
						ranked and given a grade.
					</div>
				);
			}
			ShowParagraph = <div class="-info">You have graded {gameIds.length} game{gameIds.length == 1 ? "" : "s"}.</div>;
		}

		let ShowResults = null;
		if (hasResults) {
			let Items = [];
			gameIds.map(nodeId => {
				Items.push(<GradedItem node={nodes[nodeId]} key={nodeId} />);
			});
			ShowResults = <ContentList>{Items}</ContentList>;
		}

        return (
			<div class="content-common event-mygraded">
				<h2>Items you have graded</h2>
				{ShowLoading}
				{ShowError}
				{ShowWarning}
				{ShowParagraph}
				{ShowResults}
			</div>
        );
    }
}

class GradedItem extends Component {
	render( props ) {
		const {node} = props;
		return (
			<UIButtonLink class={cN("graded-item", props.class)} href={node.path}>
				<strong>{node.name}</strong>
				<p>{node.body.substr(0, 100)}...</p>
			</UIButtonLink>
		);
	}
}
