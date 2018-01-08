import {h, Component} from 'preact/preact';

import ContentSimple					from 'com/content-simple/simple';

import ContentList				from 'com/content-list/list';
import ContentLoading			from 'com/content-loading/loading';

import UIButtonLink						from 'com/ui/button/button-link';
import InputDropdown					from 'com/input-dropdown/dropdown';
import SVGIcon 							from 'com/svg-icon/icon';
import BarChart							from 'com/visualization/barchart/barchart';

import $Grade					from 'shrub/js/grade/grade';
import $Node					from 'shrub/js/node/node';
import $Comment					from 'shrub/js/comment/comment';

const SORT_ORDER = 0;
const SORT_ALPHA = 1;
const SORT_TYPE = 2;
const SORT_GRADE_AVERAGE = 3; //The value should be the highest of the permanent sortings!

const pad = (number, digits) => {
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
		$Grade.GetAllMy(eventId)
			.then(r => {
				this.setState({'grades': r.grade});
			});

		$Grade.GetMyList(this.props.node.id)
			.then(r => {
				this.setState({
					'gameIds': r.items,
					'nodes': new Map(),
					'loading': true,
					'error': null});
				this.collectNodes(r.items, eventId);
			})
			.catch(r => {
				this.setState({'error': r, 'gameIds': null, 'loading': false});
			});

		$Comment.GetMyListByParentNode(eventId).then(r => this.collectComments(r.comment));
	}

	collectComments( commentIds ) {
		const chunkSize = 200;
		let chunkStart = 0;
		const promises = [];
		const nodesWithMyComments = new Map();
		while (true) {
			const chunk = commentIds.slice(chunkStart, chunkSize);
			if (chunk.length == 0) {
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
			while (true) {
				const gradeKey = `grade-${pad(gradeIndex, 2)}`;
				const gradeName = meta[gradeKey];
				if (gradeName) {
					gradeMapping[gradeKey] = gradeName;
					gradeIndex += 1;
				}
				else {
					break;
				}
			}
		}));
		while (true) {
			const chunk = gameIds.slice(i, i + chunkSize);
			if (chunk.length == 0) {
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
				this.setState({'loading': false, 'nodes': nodeMapping, 'gradeNames': gradeMapping});
				return this.collectAuthors(nodeMapping, gameIds);
			});
	}

	collectAuthors( mapping, gameIds ) {
		let authors = [];
		const authorsMapping = new Map();
		let promises = [];
		const chunkSize = 20;

		for (let i = 0; i < gameIds.length; i+=1) {
			const node = mapping[gameIds[i]];
			if (node.author && node.author > 0) {
				authors.push(node.author);
			}
			if (node.meta && node.meta.authors) {
				node.meta.authors.forEach(author => {
					if (author != node.author) {
						authors.push(author);
					}
				});
			}
		}
		authors = authors.filter((author, index) => authors.indexOf(author) == index);

		let i = 0;
		while (true) {
			const chunk = authors.slice(i, i + chunkSize);
			if (chunk.length == 0) {
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
		if (!authors) {
			return [];
		}

		const itemAuthors = [];
		const mainAuthor = authors[item.author];
		if (mainAuthor) {
			itemAuthors.push(mainAuthor);
		}
		if (item.meta && item.meta.authors) {
			item.meta.authors.forEach(author => {
				if (author != item.author) {
					const authorData = authors[author];
					if (authorData) {
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
		switch (sortBy) {
			case SORT_TYPE:
				return gameIds
					.map(id => [id, nodes[id].subsubtype + nodes[id].subtype + nodes[id].type]) //Get type string
					.sort((a, b) => a[1] > b[1]) //Order by type string
					.map(elem => elem[0]); //Return ids
			case SORT_ALPHA:
				return gameIds
					.map(id => [id, nodes[id].name]) //Get ids and names
					.sort((a, b) => a[1] > b[1]) //Order by names
					.map(elem => elem[0]); //Return ids
			case SORT_ORDER:
			case undefined:
				return gameIds;
			case SORT_GRADE_AVERAGE:
				return gameIds
					.map(id => {
						let currentGrades = grades[id];
						let n = 0;
						let total = 0;
						for (let grade in currentGrades) {
							n += 1;
							total += currentGrades[grade];
						}
						return [id, total / n];
					})
					.sort((a, b) => b[1] - a[1]) //Order by avg grade descending
					.map(elem => elem[0]); //Return ids
			default: // Sorting by one of the grades
				const gradeKey = `grade-${pad(sortBy - SORT_GRADE_AVERAGE, 2)}`;
				return gameIds
					.map(id => [id, grades[id][gradeKey] ? grades[id][gradeKey] : -1]) // Make those who don't have grade come last
					.sort((a, b) => b[1] - a[1]) //Order by grade descending
					.map(elem => elem[0]); //Return ids
		}
	}

    render( props, state ) {
		const {error, nodes, loading, grades, gradeNames, sortBy, myComments} = state;
		const gameIds = this.getSortedGames();
		const shouldGradeNoGames = 20;
		const hasResults = !loading && !error;
		const ShowError = error ? <div class="-warning">Could not retrieve your votes. Are you logged in?</div> : null;

		let ShowLoading = !gameIds && !error ? <ContentLoading /> : null;
		let ShowParagraph = null;
		let ShowWarning = null;
		let ShowSorting = null;

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
		let ShowStats = null;
		if (hasResults) {
			let Items = [];
			const gradeKey = sortBy && sortBy > SORT_GRADE_AVERAGE ? `grade-${pad(sortBy - SORT_GRADE_AVERAGE, 2)}` : null;
			gameIds.map(nodeId => {
				Items.push((<GradedItem
					node={nodes[nodeId]}
					grades={grades[nodeId]}
					gradeNames={gradeNames}
					focusGrade={gradeKey}
					comments={myComments ? myComments[nodeId] : null}
					authors={this.getItemAuthorsFromState(nodeId)}
					key={nodeId} />));
			});
			ShowResults = <ContentList>{Items}</ContentList>;
			sortOptions = [
				[SORT_ORDER, 'Grading order'],
				[SORT_ALPHA, 'Alphabetically'],
				[SORT_TYPE, 'Type'],
				[SORT_GRADE_AVERAGE, 'Average grade'],
			];
			let gradeIndex = 1;
			for (let gradeKey in gradeNames) {
				sortOptions.push([gradeIndex + SORT_GRADE_AVERAGE, gradeNames[gradeKey]]);
				gradeIndex += 1;
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
				</div>
			);
			ShowStats = <GradeStats grades={grades} gradeNames={gradeNames} focusGrade={gradeKey} />;
		}

        return (
			<div class="content-common event-mygraded">
				<h2>Items you have graded</h2>
				{ShowLoading}
				{ShowError}
				{ShowWarning}
				{ShowParagraph}
				{ShowStats}
				{ShowSorting}
				{ShowResults}
			</div>
        );
    }
}

class GradedItem extends Component {
	cleanGameDescription(description) {
		return description
		.replace(/!?\[[^\]]+]\([^)]+\)/g, '') //We don't want images or links
		.replace(/\*{1,2}/g, '') //We don't care for bold formatting
		.replace(/\~~[^~]+~~/g, '') //We don't want to see stuff that was over-stricken
		.replace(/#{1,3}/g, '') //Headings are just text
		.replace(/\n/g, ' '); //New line should be a space
	}

	trimDescriptionToLength(description, targetLength, maxLength) {
		const maxDescription = description.substr(0, maxLength);
		let lastPunctuation = Math.max(maxDescription.lastIndexOf('.'), maxDescription.lastIndexOf('?'), maxDescription.lastIndexOf('!'));
		if (lastPunctuation < targetLength) {
			lastPunctuation = Math.max(maxDescription.lastIndexOf(','), maxDescription.lastIndexOf(':'));
		}
		let shortened = description.substr(0, Math.max(targetLength, lastPunctuation));
		const abbreviated = shortened.length < description.length;
		shortened = shortened.trim();
		if (abbreviated) {
			shortened += shortened[shortened.length - 1] == "." ? ".." : "...";
		}
		return shortened;
	}

	getItemType( node ) {
		let TypeString = null;
		if (node.subtype) {
			if (node.subsubtype) {
				TypeString = node.subsubtype.toUpperCase() + ": " + node.subtype.toUpperCase();
			}
			else {
				TypeString = node.subtype.toUpperCase();
			}
		}
		else if (node.type) {
			TypeString = node.type.toUpperCase();
		}

		if (TypeString) {
			return <div class="-item-type">{TypeString}</div>;
		}
		return null;
	}

	render( props ) {
		const {node, authors, grades, gradeNames, focusGrade, comments} = props;
		let description = this.cleanGameDescription(node.body);
		description = this.trimDescriptionToLength(description, 100, 175);
		let ShowAuthors = null;
		if (authors && authors.length > 0) {
			const AuthorList = [];
			authors.forEach((author, index) => {
				if (index > 0 && index == authors.length - 1) {
					AuthorList.push(' & ');
				}
				else if (index > 0) {
					AuthorList.push(', ');
				}
				AuthorList.push(<div class="-at-name">@{author.slug}</div>);
			});
			ShowAuthors = <p class="-authors">{AuthorList}</p>;
		}

		const Grades = [];
		for (let grade in grades) {
			Grades.push(<div class={cN("-grade", grade == focusGrade ? "-focused" : "")} key={grade}><div class="-grade-label">{gradeNames[grade]}:</div>{grades[grade]}</div>);
		}
		const ShowGrades = <div class="-grades">{Grades}</div>;
		const ShowComments = comments ? <SVGIcon>{comments > 1 ? 'bubbles' : 'bubble'}</SVGIcon> : null;

		return (
			<UIButtonLink class={cN("graded-item", props.class)} href={node.path}>
				{this.getItemType(node)}
				<strong>{node.name}</strong>
				{ShowComments}
				{ShowAuthors}
				<p>{description}</p>
				{ShowGrades}
			</UIButtonLink>
		);
	}
}

class GradeStats extends Component {
	getHistogram( grades, gradeKey, hist) {
		if (!hist) {
			hist = {};
		}
		for (let gradedItem in grades) {
			const grade = grades[gradedItem][gradeKey];
			if (grade) {
				if (!hist[grade]) {
					hist[grade] = 1;
				}
				else {
					hist[grade] += 1;
				}
			}
		}
		return hist;
	}

	getGlobalHistogram( grades, gradeNames ) {
		let hist = {};
		for (let gradeKey in gradeNames) {
			hist = this.getHistogram(grades, gradeKey, hist);
		}
		return hist;
	}

	getAverage( grades, gradeKey ) {
		let sum = 0;
		let n = 0;
		for (let gradedItem in grades) {
			const grade = grades[gradedItem][gradeKey];
			if (grade) {
				sum += grade;
				n += 1;
			}
		}
		return sum / n;
	}

	render( props ) {
		const {grades, gradeNames, focusGrade} = props;
		const gradeAvgs = [];
		const gradeNamesList = [];
		for (let grade in gradeNames) {
			gradeNamesList.push(gradeNames[grade]);
			gradeAvgs.push(this.getAverage(grades, grade));
		}
		const ShowAvgPerType = <BarChart values={gradeAvgs} labels={gradeNamesList} use_percentages={false}/>;
		let HistName = null;
		let hist = null;
		if (focusGrade) {
			hist = this.getHistogram(grades, focusGrade);
			HistName = gradeNames[focusGrade];
		}
		else {
			hist = this.getGlobalHistogram(grades, gradeNames);
			HistName = "total";
		}
		const gradeLevels = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
		const ShowHistGraph = (
			<BarChart
				values={gradeLevels.map(v => hist[v] ? hist[v] : 0)}
				labels={gradeLevels.map(v => `${v} star${v > 1 ? 's' : ''}`)}
				use_percentages={false} />
		);

		return (
			<div class="-graphs">
				<div class="-graph">
					<h3>Average grade per category:</h3>
					{ShowAvgPerType}
				</div>
				<div>
					<h3>Distribution of stars ({HistName}):</h3>
					{ShowHistGraph}
				</div>
			</div>
		);
	}
}
