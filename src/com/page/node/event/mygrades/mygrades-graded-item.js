import {h, Component}					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import UIButtonLink						from 'com/ui/button/button-link';

export default class GradedItem extends Component {
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
		for ( let gradeKey in gradeNames ) {
			const grade = grades.filter(grade => (grade.name == gradeKey));
			if ( gradeNames[gradeKey] && (grade.length === 1) ) {
				Grades.push(<div class={cN("-grade", (grade[0].name == focusGrade) ? "-focused" : "")} key={gradeKey}><div class="-grade-label">{gradeNames[gradeKey]}:</div>{grade[0].value}</div>);
			}
		}
		const ShowGrades = <div class="-grades">{Grades}</div>;
		const ShowComments = comments ? (<SVGIcon>{comments > 1 ? 'bubbles' : 'bubble'}</SVGIcon>) : null;

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
