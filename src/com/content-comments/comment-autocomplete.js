import {h, Component} 				from 'preact/preact';
import UIButton						from 'com/ui/button/button';

class Autocompletions extends Component {
	componentWillReceiveProps(nextProps) {
		let {text, cursorPos} = nextProps;
		//console.log('New props', nextProps);
		if (text) {
			cursorPos = cursorPos ? cursorPos : 0;
			const {startPattern, endPattern} = this.state;
			const left = text.slice(0, cursorPos).match(startPattern);
			const right = text.slice(cursorPos).match(endPattern);
			if (left) {
				this.setState({
					'match': left[2] + right[0],
					'matchStart': cursorPos - left[2].length,
					'matchEnd': cursorPos + right[0].length,
				});
			}
			else {
				this.setState({'match': null});
			}
		}
		else {
			this.setState({'match': null});
		}
	}

	handleSelect(item, e) {
		/* Bind per element so that the match/item is the first argument.
		*/
		const {onSelect, text} = this.props;
		const {matchStart, matchEnd} = this.state;
		const updatedText = text.slice(0, matchStart) + item.name + text.slice(matchEnd);
		this.setState({
			'selected': item.name,
			'match': item.name,
			'text': updatedText,
		});
		if (onSelect) {
			onSelect(updatedText, matchStart + item.name.length);
		}
	}

	getMatching(hint) {
		/* Should return an array of objects that contains the
		fields `name` and `score`. Could have more fields if useful for the render function and callbacks.
		Name should be the exact word that is expected to be written in
		the input if option is selected.
		*/
		return [];
	}

	renderSuggestion(item, classModifier) {
		/* Should return a JSX element rendering the option
		*/
		return null;
	}

	render( props, state ) {
		const {selected, match} = state;
		if (match && match != selected) {
			const matches = this.getMatching(match).sort((a, b) => b.score - a.score);
			let selectedIndex = 0;
			if (selected) {
				const selectedMatch = matches.map((m, i) => [m, i]).filter(m => m[0].name == selected);
				if (selectedMatch.length == 1) {
					selectedIndex = selectedMatch[0][1];
				}
			}
			if (selected ? matches.length > 1 || (matches.length == 1 && matches[0].length != selected) : matches.length > 0) {
				return <div class={cN("-auto-complete", props.class)}>{matches.map((m, i) => this.renderSuggestion(m, i == selectedIndex ? '-selected' : ''))}</div>;
			}
		}
	}
}

export class AutocompleteAtNames extends Autocompletions {
	constructor(props) {
		super(props);
		this.state = {
			'startPattern': /([\s ]|^)(@[A-Za-z-_0-9]*)$/,
			'endPattern': /^[A-Za-z-_0-9]*/,
		};
	}

	getMatching(hint) {
		const {authors} = this.props;
		const matches = [];
		const hintWithoutAt = hint.substr(1);
		if (authors) {
			for (let author in authors) {
				const authorData = authors[author];
				const matchStart = authorData.name.indexOf(hintWithoutAt);
				if (hint.length == 0 || matchStart > -1) {
					let score = matchStart == 0 ? 1 : 0.5;
					score = Math.pow(hint.length / authorData.name.length, score);
					matches.push({
						'name': '@' + authorData.name,
						'score': score,
					});
				}
			}
		}
		return matches;
	}

	renderSuggestion(item, classModifier) {
		return <UIButton key={item.name} class={cN(classModifier)} onclick={this.handleSelect.bind(this, item)}>{item.name}</UIButton>;
	}
}
