import {h, Component}					from 'preact/preact';
import PageNavEventMy					from '../../../nav/event-my';

import ContentList						from 'com/content-list/list';
import ContentLoading					from 'com/content-loading/loading';
import InputDropdown					from 'com/input-dropdown/dropdown';

import GradedItem						from './mygrades-graded-item';
import GradeGraphs						from './mygrades-grade-graphs';

import $Grade							from 'shrub/js/grade/grade';
import $Node							from 'shrub/js/node/node';
import $Comment							from 'shrub/js/comment/comment';

const SORT_ORDER = 0;
const SORT_ALPHA = 1;
const SORT_TYPE = 2;
const SORT_GRADE_AVERAGE = 3; //The value should be the highest of the permanent sortings!

const pad = ( number, digits ) => {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
};

export default class MyGrades extends Component {
	constructor( props ) {
		super(props);
		this.state = {
			'loading': true,
		};
		this.onSortByChange = this.onSortByChange.bind(this);
	}

	componentDidMount() {
		const eventId = this.props.node.id;
		const promiseAllMy = $Grade.GetAllMy(eventId)
			.then(r => {
				this.setState({'grades': r.grade});
			});
		const promiseMyList = $Grade.GetMyList(this.props.node.id)
			.then(r => {
				this.setState({
					'gameIds': r.items,
					'nodes': new Map(),
					'error': null});
				return this.collectNodes(r.items, eventId);
			})
			.catch(r => {
				this.setState({'error': r, 'gameIds': null});
			});
		const promiseComments = $Comment.GetMyListByParentNode(eventId).then(r => (this.collectComments(r.comment)));
		Promise.all([promiseAllMy, promiseMyList, promiseComments]).then(() => {
			this.setState({'loading': false});
		});
	}

	collectComments( commentIds ) {
		const chunkSize = 200;
		let chunkStart = 0;
		const promises = [];
		const nodesWithMyComments = new Map();
		while ( true ) {
			const chunk = commentIds.slice(chunkStart, chunkSize);
			if ( chunk.length == 0 ) {
				break;
			}
			promises.push($Comment.Get(chunk).then(r => {
				r.comment.forEach(comment => {
					if (nodesWithMyComments[comment.node]) {
						nodesWithMyComments[comment.node] += 1;
					}
					else {
						nodesWithMyComments[comment.node] = 1;
					}
				});
			}));
			chunkStart += chunkSize;
		}
		return Promise.all(promises).then(r => {
			this.setState({'myComments': nodesWithMyComments});
		});
	}

	collectNodes( gameIds, eventId ) {
		const promises = [];
		let nodeMapping = new Map();
		let gradeMapping = new Map();
		const chunkSize = 20;
		let i = 0;
		promises.push($Node.Get(eventId).then(r => {
			const {meta} = r.node[0];
			let gradeIndex = 1;
			while ( true ) {
				const gradeKey = 'grade-' + pad(gradeIndex, 2);
				const gradeName = meta[gradeKey];
				if ( gradeName ) {
					gradeMapping[gradeKey] = gradeName;
					gradeIndex += 1;
				}
				else {
					break;
				}
			}
		}));
		while ( true ) {
			const chunk = gameIds.slice(i, i + chunkSize);
			if ( chunk.length == 0 ) {
				break;
			}
			promises.push($Node.Get(chunk)
				.then(r => {
					r.node.map(node => {
						nodeMapping[node.id] = node;
					});
				})
				.catch(r => {
					this.setState({'error': r});
				})
			);
			i += chunkSize;
		}
		return Promise.all(promises)
			.then(r => {
				this.setState({'nodes': nodeMapping, 'gradeNames': gradeMapping});
				return this.collectAuthors(nodeMapping, gameIds);
			});
	}

	collectAuthors( mapping, gameIds ) {
		let authors = [];
		const authorsMapping = new Map();
		let promises = [];
		const chunkSize = 20;
		for ( let i = 0; i < gameIds.length; i+=1 ) {
			const node = mapping[gameIds[i]];
			if ( node.author && (node.author > 0) ) {
				authors.push(node.author);
			}
			if ( node.meta && node.meta.authors ) {
				node.meta.authors.forEach(author => {
					if ( author != node.author ) {
						authors.push(author);
					}
				});
			}
		}
		authors = authors.filter((author, index) => (authors.indexOf(author) == index));
		let i = 0;
		while ( true ) {
			const chunk = authors.slice(i, i + chunkSize);
			if ( chunk.length == 0 ) {
				break;
			}
			promises.push($Node.Get(chunk)
				.then(r => {
					r.node.map(node => {
						authorsMapping[node.id] = node;
					});
				})
				.catch(r => {
					this.setState({'error': r});
				})
			);
			i += chunkSize;
		}
		return Promise.all(promises)
			.then(r => {
				this.setState({'authors': authorsMapping});
			});
	}

	getItemAuthorsFromState( gameId ) {
		const item = this.state.nodes[gameId];
		const authors = this.state.authors;
		if ( !authors ) {
			return [];
		}
		const itemAuthors = [];
		const mainAuthor = authors[item.author];
		if ( mainAuthor ) {
			itemAuthors.push(mainAuthor);
		}
		if ( item.meta && item.meta.authors ) {
			item.meta.authors.forEach(author => {
				if ( author != item.author ) {
					const authorData = authors[author];
					if ( authorData ) {
						itemAuthors.push(authorData);
					}
				}
			});
		}
		return itemAuthors;
	}

	onSortByChange( newSort ) {
		this.setState({'sortBy': newSort});
	}

	getSortedGames() {
		const {gameIds, nodes, sortBy, grades} = this.state;
		switch ( sortBy ) {
			case SORT_TYPE:
				return gameIds
					.map(id => [id, nodes[id].subsubtype + nodes[id].subtype + nodes[id].type]) //Get type string
					.sort((a, b) => (a[1] > b[1])) //Order by type string
					.map(elem => elem[0]); //Return ids
			case SORT_ALPHA:
				return gameIds
					.map(id => [id, nodes[id].name]) //Get ids and names
					.sort((a, b) => (a[1] > b[1])) //Order by names
					.map(elem => elem[0]); //Return ids
			case SORT_ORDER:
			case undefined:
				return gameIds;
			case SORT_GRADE_AVERAGE:
				return gameIds
					.map(id => {
						let itemGrades = grades.filter(grade => grade.id === id).map(grade => grade.value);
						let sum = itemGrades.reduce((a, b) => a + b);
						return [id, sum / itemGrades.length];
					})
					.sort((a, b) => (b[1] - a[1])) //Order by avg grade descending
					.map(elem => elem[0]); //Return ids
			default: // Sorting by one of the grades
				const gradeKey = 'grade-' + pad(sortBy - SORT_GRADE_AVERAGE, 2);
				return gameIds
					.map(id => {
						let grade = grades.filter(grade => grade.id === id && grade.name === gradeKey);
						return [id, grade.length == 1 ? grade[0].value : -1];
					}) // Make those who don't have grade come last
					.sort((a, b) => (b[1] - a[1])) //Order by grade descending
					.map(elem => elem[0]); //Return ids
		}
	}

	render( props, state ) {
		const {error, nodes, loading, grades, gradeNames, sortBy, myComments} = state;
		const gameIds = this.getSortedGames();
		const shouldGradeNoGames = 20;
		const hasResults = !loading && !error;
		const ShowError = error ? (<div class="-warning">Could not retrieve your votes. Are you logged in?</div>) : null;
		const gradeKey = sortBy && ((sortBy > SORT_GRADE_AVERAGE) ? ('grade-' + pad(sortBy - SORT_GRADE_AVERAGE, 2)) : null);
		let ShowLoading = !gameIds && (!error ? <ContentLoading /> : null);
		let ShowParagraph = null;
		let ShowWarning = null;
		let ShowSorting = null;
		let ShowResults = null;
		let ShowStats = null;

		// Is this (!!) intentional? If so, document why.
		if ( !!gameIds ) {
			if ( gameIds.length < shouldGradeNoGames ) {
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
			if ( gameIds.length > 0 ) {
				ShowStats = (
					<GradeGraphs
						grades={grades}
						gradeNames={gradeNames}
						focusGrade={gradeKey}
						showByType={sortBy == SORT_TYPE}
						showTrend={(sortBy == SORT_ORDER) || !sortBy}
						nodes={gameIds.map(id => nodes[id])}
					/>
				);
			}
		}

		if ( hasResults ) {
			let Items = [];
			gameIds.map(nodeId => {
				Items.push((<GradedItem
					node={nodes[nodeId]}
					grades={grades.filter(grade => grade.id == nodeId)}
					gradeNames={gradeNames}
					focusGrade={gradeKey}
					comments={myComments ? myComments[nodeId] : null}
					authors={this.getItemAuthorsFromState(nodeId)}
					key={nodeId} />));
			});
			ShowResults = <ContentList>{Items}</ContentList>;
			let SortDescription = null;
			sortOptions = [
				[SORT_ORDER, 'Grading order'],
				[SORT_ALPHA, 'Alphabetically'],
				[SORT_TYPE, 'Type'],
				[SORT_GRADE_AVERAGE, 'Average grade'],
			];
			let gradeIndex = 1;
			for ( let gradeKey in gradeNames ) {
				sortOptions.push([gradeIndex + SORT_GRADE_AVERAGE, gradeNames[gradeKey]]);
				gradeIndex += 1;
			}
			switch ( sortBy ) {
				case SORT_ORDER:
				case undefined:
					SortDescription = <div class="-description">Showing the games in the order you graded them.</div>;
					break;
				case SORT_TYPE:
					SortDescription = <div class="-description">Showing first by class (JAM/COMPO) and then by item type (probably just GAME).</div>;
					break;
				case SORT_GRADE_AVERAGE:
					SortDescription = <div class="-description">Showing by average grade across all categories.</div>;
					break;
			}
			ShowSorting = (
				<div class="-sort-by">
					Sort by:
					<InputDropdown class="-tag"
						items={sortOptions}
						value={state.sortBy}
						onmodify={this.onSortByChange}
						useClickCatcher={false}
						selfManaged={true}
					/>
					{SortDescription}
				</div>
			);
		}

		return (
			<div>
				<PageNavEventMy {...props} />
				<div class="content-common event-mygraded">
					<h2>Items you have graded</h2>
					{ShowLoading}
					{ShowError}
					{ShowWarning}
					{ShowParagraph}
					{ShowSorting}
					{ShowStats}
					{ShowResults}
				</div>
			</div>
		);
	}
}
