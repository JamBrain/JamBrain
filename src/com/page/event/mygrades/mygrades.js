import {h, Component}					from 'preact/preact';
import ContentSimple					from 'com/content-simple/simple';
import ContentList						from 'com/content-list/list';
import ContentLoading					from 'com/content-loading/loading';
import UIButtonLink						from 'com/ui/button/button-link';
import InputDropdown					from 'com/input-dropdown/dropdown';
import SVGIcon 							from 'com/svg-icon/icon';
import BarChart							from 'com/visualization/barchart/barchart';
import PieChart							from 'com/visualization/piechart/piechart';
import $Grade							from 'shrub/js/grade/grade';
import $Node							from 'shrub/js/node/node';
import $Comment							from 'shrub/js/comment/comment';

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
				this.setState({'loading': false, 'nodes': nodeMapping, 'gradeNames': gradeMapping});
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
					<GradeStats
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
        );
    }
}

class GradedItem extends Component {
	cleanGameDescription( description ) {
		return description
			.replace(/!?\[[^\]]+]\([^)]+\)/g, '') //We don't want images or links
			.replace(/\*{1,2}/g, '') //We don't care for bold formatting
			.replace(/\~~[^~]+~~/g, '') //We don't want to see stuff that was over-stricken
			.replace(/#{1,3}/g, '') //Headings are just text
			.replace(/\n/g, ' '); //New line should be a space
	}

	trimDescriptionToLength( description, targetLength, maxLength ) {
		const maxDescription = description.substr(0, maxLength);
		let lastPunctuation = Math.max(maxDescription.lastIndexOf('.'), maxDescription.lastIndexOf('?'), maxDescription.lastIndexOf('!'));
		if ( lastPunctuation < targetLength ) {
			lastPunctuation = Math.max(maxDescription.lastIndexOf(','), maxDescription.lastIndexOf(':'));
		}
		let shortened = description.substr(0, Math.max(targetLength, lastPunctuation));
		const abbreviated = shortened.length < description.length;
		shortened = shortened.trim();
		if ( abbreviated ) {
			shortened += (shortened[shortened.length - 1] == ".") ? ".." : "...";
		}
		return shortened;
	}

	getItemType( node ) {
		let TypeString = null;
		if ( node.subtype ) {
			if ( node.subsubtype ) {
				TypeString = node.subsubtype.toUpperCase() + ": " + node.subtype.toUpperCase();
			}
			else {
				TypeString = node.subtype.toUpperCase();
			}
		}
		else if ( node.type ) {
			TypeString = node.type.toUpperCase();
		}
		if ( TypeString ) {
			return <div class="-item-type">{TypeString}</div>;
		}
		return null;
	}

	render( props ) {
		const {node, authors, grades, gradeNames, focusGrade, comments} = props;
		let description = this.cleanGameDescription(node.body);
		description = this.trimDescriptionToLength(description, 100, 175);

		let ShowAuthors = null;
		if ( authors && (authors.length > 0) ) {
			const AuthorList = [];
			authors.forEach((author, index) => {
				if ( (index > 0) && (index == (authors.length - 1)) ) {
					AuthorList.push(' & ');
				}
				else if ( index > 0 ) {
					AuthorList.push(', ');
				}
				AuthorList.push(<div class="-at-name">@{author.slug}</div>);
			});
			ShowAuthors = <p class="-authors">{AuthorList}</p>;
		}

		const Grades = [];
		for (let gradeKey in gradeNames) {
			const grade = grades.filter(grade => grade.name == gradeKey);
			if (gradeNames[gradeKey] && grade.length === 1) {
				Grades.push(<div class={cN("-grade", (grade[0].name == focusGrade) ? "-focused" : "")} key={gradeKey}><div class="-grade-label">{gradeNames[gradeKey]}:</div>{grade[0].value}</div>);
			}
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
	getHistogram( grades, gradeKey, hist ) {
		if ( !hist ) {
			hist = {};
		}
		const filteredGrades = grades.filter(grade => grade.name == gradeKey).map(grade => grade.value);
		filteredGrades.forEach(grade => {
			if ( !hist[grade] ) {
				hist[grade] = 1;
			}
			else {
				hist[grade] += 1;
			}
		});
		return hist;
	}

	getGlobalHistogram( grades, gradeNames ) {
		let hist = {};
		for ( let gradeKey in gradeNames ) {
			hist = this.getHistogram(grades, gradeKey, hist);
		}
		return hist;
	}

	getAverage( grades, gradeKey, decimals) {
		const values = grades.filter(grade => grade.name == gradeKey).map(grade => grade.value);
		return this.averageArray(values, decimals);
	}

	countTypes( nodes ) {
		const counter = {};
		nodes.forEach(node => {
			const nodeType = node.subsubtype.toUpperCase() + ': ' + node.subtype.toUpperCase();
			if ( counter[nodeType] ) {
				counter[nodeType] += 1;
			}
			else {
				counter[nodeType] = 1;
			}
		});
		return counter;
	}

	getVotesBias( grades, filter, gradeNames ) {
		const bias = {};
		for ( let gradeKey in gradeNames ) {
			const groupA = this.getAverage(grades.filter((f, idx) => filter[idx]), gradeKey, 1);
			const groupB = this.getAverage(grades.filter((f, idx) => !filter[idx]), gradeKey, 1);
			bias[gradeKey] = groupA - groupB;
		}
		return bias;
	}

	binGrades( grades ) {
		if (!grades) {
			return NaN;
		}
		const bins = {};
		grades.forEach(grade => {
			const bin = grade.timestamp.split(' ', 1)[0]; //Get date
			const {value, id} = grade;
			if ( bins[bin] ) {
				bins[bin].push([id, value]);
			}
			else {
				bins[bin] = [[id, value]];
			}
		});
		return bins;
	}

	getDateRange( startDate, endDate ) {
		const addDay = d => new Date(d.getTime() + (24 * 60 * 60000));
		let dates = [];
		let mm = startDate.getMonth() + 1;
		let dd = startDate.getDate();

		dates.push([startDate.getFullYear(), ((mm > 9) ? '' : '0') + mm, ((dd > 9) ? '' : '0') + dd].join('-'));
		let cur = addDay(startDate);
		while ( cur <= endDate ) {
			mm = cur.getMonth() + 1;
			dd = cur.getDate();
			dates.push([cur.getFullYear(), ((mm > 9) ? '' : '0') + mm, ((dd > 9) ? '' : '0') + dd].join('-'));
			cur = addDay(cur);
		}
		return dates;
	}

	getDayLabels( binnedGrades ) {
		let labels = [];
		for ( let label in binnedGrades ) {
			labels.push(label);
		}
		if ( labels.length > 0 ) {
			labels = labels.map(date => new Date(date)).sort((a, b) => (a - b));
			return this.getDateRange(labels[0], labels[labels.length - 1]);
		}
		else {
			return [];
		}
	}

	averageArray( arr, decimals ) {
		return Number((arr.reduce((a, b) => a + b) / arr.length).toFixed(decimals));
	}

	render( props ) {
		const {grades, gradeNames, focusGrade, nodes, showByType, showTrend} = props;
		const gradeAvgs = [];
		const GradeNamesList = [];
		let ShowSummaryGraph = null;
		let ShowDetailGraph = null;
		const binnedGrades = showTrend ? this.binGrades(grades) : null;
		const binnedGradesDays = showTrend ? this.getDayLabels(binnedGrades) : null;
		for ( let grade in gradeNames ) {
			GradeNamesList.push(gradeNames[grade]);
		}

		if ( showByType ) {
			const counts = this.countTypes(nodes);
			let sum = 0;
			const typeLabels = [];
			const typeCounts = [];
			for ( let countLabel in counts ) {
				typeLabels.push(countLabel);
				typeCounts.push(counts[countLabel]);
				sum += counts[countLabel];
			}
			ShowSummaryGraph = (
				<div class="-graph">
					<h3>Graded items per type</h3>
					<PieChart values={typeCounts} labels={typeLabels} use_percentages={true}/>
				</div>
			);
		}
		else if ( showTrend ) {
			let GradeCounts = binnedGradesDays.map(date => binnedGrades[date] ? binnedGrades[date].map(e => e[0]) : []); //Get lists of item IDs per date
			GradeCounts = GradeCounts.map(items => items.filter((itemId, idx) => (items.indexOf(itemId) == idx)).length); //Unique item ID count per date
			ShowSummaryGraph = (
				<div class="-graph">
					<h3>Graded items per day</h3>
					<BarChart values={GradeCounts} labels={binnedGradesDays} use_percentages={false} hideLegend />
				</div>
			);

		}
		else {
			for ( let grade in gradeNames ) {
				gradeAvgs.push(this.getAverage(grades, grade, 2));
			}
			ShowSummaryGraph = (
				<div class="-graph">
					<h3>Average grade per category</h3>
					<BarChart values={gradeAvgs} labels={GradeNamesList} use_percentages={false} />
				</div>
			);
		}

		let DetailGraphTitle = null;
		let votesData = null;
		let DetailLabels = null;
		let DetailValues = null;
		let DetailCaption = null;
		const DetailProps = {};
		const gradeLevels = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

		if ( focusGrade ) {
			votesData = this.getHistogram(grades, focusGrade);
			DetailGraphTitle = 'Distribution of stars (' + gradeNames[focusGrade] + '):';
			DetailValues = gradeLevels.map(v => votesData[v] ? votesData[v] : 0);
			DetailLabels = gradeLevels.map(v => v + ' star' + (v > 1 ? 's' : ''));
		}
		else if ( showByType ) {
			DetailGraphTitle = 'JAM vs COMPO average bias';
			DetailLabels = GradeNamesList;
			votesData = this.getVotesBias(
				nodes.map(node => grades.filter(grade => grade.id == node.id)),
				nodes.map(node => (node.subsubtype == 'jam')),
				gradeNames);
			DetailValues = [];
			for ( let grade in gradeNames ) {
				DetailValues.push(votesData[grade]);
			}
			DetailCaption = <div class="-caption">Positive values indicate you give higher grades to JAM items. Negative that you give higher grades to COMPO items.</div>;
		}
		else if ( showTrend ) {
			DetailGraphTitle = 'Total average grade per day';
			DetailValues = binnedGradesDays.map(date => binnedGrades[date] ? this.averageArray(binnedGrades[date].map(e => e[1]), 1) : NaN);
			DetailLabels = binnedGradesDays;
			DetailProps.hideLegend = true;

		}
		else {
			votesData = this.getGlobalHistogram(grades, gradeNames);
			DetailGraphTitle = 'Total distribution of stars';
			DetailValues = gradeLevels.map(v => votesData[v] ? votesData[v] : 0);
			DetailLabels = gradeLevels.map(v => v + ' star' + (v > 1 ? 's' : ''));
		}

		ShowDetailGraph = (
			<div class="-graph">
				<h3>{DetailGraphTitle}</h3>
				<BarChart
					values={DetailValues}
					labels={DetailLabels}
					use_percentages={false}
					{...DetailProps}
				/>
				{DetailCaption}
			</div>
		);

		return (
			<div class="-graphs">
				{ShowSummaryGraph}
				{ShowDetailGraph}
			</div>
		);
	}
}
