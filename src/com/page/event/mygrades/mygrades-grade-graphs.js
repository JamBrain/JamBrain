import {h, Component}					from 'preact/preact';

import BarChart							from 'com/visualization/barchart/barchart';
import PieChart							from 'com/visualization/piechart/piechart';

export default class GradeGraphs extends Component {
	getHistogram( grades, gradeKey, hist ) {
		if ( !hist ) {
			hist = {};
		}
		const filteredGrades = grades.filter(grade => (grade.name == gradeKey)).map(grade => grade.value);
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

	getAverage( grades, gradeKey, decimals ) {
		const values = grades.filter(grade => (grade.name == gradeKey)).map(grade => grade.value);
		return this.averageArray(values, decimals);
	}

	countTypes( nodes ) {
		const counter = {};
		nodes.forEach(node => {
			const nodeType = node.subsubtype.toUpperCase() + ": " + node.subtype.toUpperCase();
			if ( counter[nodeType] ) {
				counter[nodeType] += 1;
			}
			else {
				counter[nodeType] = 1;
			}
		});
		return counter;
	}

	getVotesBias( jamGrades, compoGrades, gradeNames ) {
		const bias = {};
		for ( let gradeKey in gradeNames ) {
			const jamAvg = this.getAverage(jamGrades, gradeKey, 5);
			const compoAvg = this.getAverage(compoGrades, gradeKey, 5);
			bias[gradeKey] = Number((jamAvg - compoAvg).toFixed(1));
		}
		return bias;
	}

	binGrades( grades ) {
		if ( !grades ) {
			return NaN;
		}
		const bins = {};
		grades.forEach(grade => {
			const bin = grade.timestamp.split(" ", 1)[0]; //Get date
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
		if ( arr.length == 0 ) {
			return NaN;
		}
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
			let GradeCounts = binnedGradesDays.map(date => (binnedGrades[date] ? binnedGrades[date].map(e => e[0]) : [])); //Get lists of item IDs per date
			GradeCounts = GradeCounts.map(items => items.filter((itemId, idx) => (items.indexOf(itemId) == idx)).length); //Unique item ID count per date
			ShowSummaryGraph = (
				<div class="-graph">
					<h3>Graded items per day</h3>
					<BarChart values={GradeCounts} labels={binnedGradesDays} use_percentages={false} hideLegend showXAxis showYAxis showYTicks />
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
					<BarChart values={gradeAvgs} labels={GradeNamesList} use_percentages={false} showXAxis showYAxis showYTicks />
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
			DetailGraphTitle = "Distribution of stars (" + gradeNames[focusGrade] + "):";
			DetailValues = gradeLevels.map(v => (votesData[v] ? votesData[v] : 0));
			DetailLabels = gradeLevels.map(v => (v + " star" + (v > 1 ? "s" : "")));
			DetailProps.showXAxis = true;
			DetailProps.showYAxis = true;
			DetailProps.showYTicks = true;
		}
		else if ( showByType ) {
			DetailGraphTitle = "JAM vs COMPO average bias";
			DetailLabels = GradeNamesList;
			votesData = this.getVotesBias(
				grades.filter(grade => (nodes.filter(node => (node.id == grade.id))[0].subsubtype == 'jam')),
				grades.filter(grade => (nodes.filter(node => (node.id == grade.id))[0].subsubtype != 'jam')),
				gradeNames
			);
			DetailValues = [];
			for ( let grade in gradeNames ) {
				DetailValues.push(votesData[grade]);
			}
			DetailCaption = <div class="-caption">Positive values indicate you give higher grades to JAM items. Negative that you give higher grades to COMPO items.</div>;
			DetailProps.showXAxis = true;
			DetailProps.showYAxis = true;
			DetailProps.showYTicks = true;
		}
		else if ( showTrend ) {
			DetailGraphTitle = "Total average grade per day";
			DetailValues = binnedGradesDays.map(date => (binnedGrades[date] ? this.averageArray(binnedGrades[date].map(e => e[1]), 1) : NaN));
			DetailLabels = binnedGradesDays;
			DetailProps.hideLegend = true;
			DetailProps.showXAxis = true;
			DetailProps.showYAxis = true;
			DetailProps.showYTicks = true;
		}
		else {
			votesData = this.getGlobalHistogram(grades, gradeNames);
			DetailGraphTitle = "Total distribution of stars";
			DetailValues = gradeLevels.map(v => (votesData[v] ? votesData[v] : 0));
			DetailLabels = gradeLevels.map(v => (v + " star" + (v > 1 ? "s" : "")));
			DetailProps.showXAxis = true;
			DetailProps.showYAxis = true;
			DetailProps.showYTicks = true;
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
