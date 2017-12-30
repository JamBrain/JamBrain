import {h, Component} 				from 'preact/preact';
import UIButton						from 'com/ui/button/button';

class Autocompletions extends Component {
	constructor(props) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	onKeyDown( e ) {
		switch (e.key) {
			case "Escape":
				this.handleAbort();
				return false;
			case "ArrowUp":
				this.updateSelected(-1);
				return false;
			case "ArrowDown":
				this.updateSelected(1);
				return false;
			case "Enter":
				this.selectSelected();
				return false;
		}
		return true;
	}

	componentWillReceiveProps( nextProps ) {
		let {text, cursorPos} = nextProps;
		//console.log('New props', nextProps);
		if (text) {
			cursorPos = cursorPos ? cursorPos : 0;
			const matchObj = this.getMatch(text, cursorPos);
			if (matchObj) {
				this.setState({
					'text': text,
					'cursorPos': cursorPos,
					'match': matchObj.match,
					'matchStart': matchObj.matchStart,
					'matchEnd': matchObj.matchEnd,
					'selected': null,
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

	getMatch( text, cursorPos ) {
		const {startPattern, endPattern} = this.state;
		const left = text.slice(0, cursorPos).match(startPattern);
		if (!left) {
			return null;
		}
		const right = text.slice(cursorPos).match(endPattern);
		return {
			'match': left[2] + right[0],
			'matchStart': cursorPos - left[2].length,
			'matchEnd': cursorPos + right[0].length,
		};
	}

	selectSelected() {
		const {text, cursorPos, match, matchStart, matchEnd} = this.state;
		const {onSelect} = this.props;
		let {selected} = this.state;
		if (!selected) {
			selected = this.getMatching(match).sort((a, b) => b.score - a.score)[0].name;
		}
		const updatedText = text.slice(0, matchStart) + selected + text.slice(matchEnd);
		this.setState({'text': updatedText});
		if (onSelect) {
			onSelect(updatedText, cursorPos + selected.length);
		}

	}

	updateSelected(indexChange) {
	}

	handleAbort() {
		const {text, cursorPos, match} = this.state;
		const {onSelect} = this.props;
		this.setState({'selected': match});
		if (onSelect) {
			onSelect(text, cursorPos);
		}
	}

	handleSelect( item, e ) {
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

	getMatching( hint ) {
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
		const {match, name} = state;
		let {maxItems, selected} = state;

		if (match && match != selected) {
			if (!maxItems) {
				maxItems = 8;
			}
			const matches = this.getMatching(match).sort((a, b) => b.score - a.score).slice(0, maxItems);
			let selectedIndex = 0;
			if (selected) {
				const selectedMatch = matches.map((m, i) => [m, i]).filter(m => m[0].name == selected);
				if (selectedMatch.length == 1) {
					selectedIndex = selectedMatch[0][1];
				}
			}
			else if (matches.length > 0) {
				selected = matches[0].name;
			}
			if (selected ? matches.length > 1 || (matches.length == 1 && matches[0].name != match) : matches.length > 0) {
				props.captureKeyDown(name, this.onKeyDown);
				return (
					<div class={cN("-auto-complete", props.class)} tabindex="0" ref={(elem) => this.autocompleteContainer = elem}>
						{matches.map((m, i) => this.renderSuggestion(m, i == selectedIndex ? '-selected' : ''))}
					</div>
				);
			}
			else {
				props.captureKeyDown(name, null);
			}
		}
	}
/*
	componentDidUpdate() {
		if (this.autocompleteContainer && !this.autocompleteContainer.onkeyup) {
			this.autocompleteContainer.onkeyup = this.onKeyUp;
			this.autocompleteContainer.onkeydown = this.onKeyDown;
			//console.log(this.autocompleteContainer, this.autocompleteContainer.focus);
		}
		if (this.autocompleteContainer) {
			//this.autocompleteContainer.focus();
		}
	}
	*/
}

export class AutocompleteAtNames extends Autocompletions {
	constructor(props) {
		super(props);
		this.state = {
			'name': 'at-names',
			'startPattern': /([\s ]|^)(@[A-Za-z-_0-9]*)$/,
			'endPattern': /^[A-Za-z-_0-9]*/,
			'maxItems': 8,
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
		let {match} = this.state;
		match = match.substr(1);
		let ShowLeft = null;
		let ShowMatch = null;
		let ShowRight = null;
		if (match.length) {
			const matchStart = item.name.indexOf(match);
			ShowLeft = item.name.substr(0, matchStart);
			ShowMatch = <b>{match}</b>;
			ShowRight = item.name.substr(matchStart + match.length);
		}
		else {
			ShowLeft = item.name;
		}
		return <UIButton key={item.name} class={cN(classModifier)} onclick={this.handleSelect.bind(this, item)}>{ShowLeft}{ShowMatch}{ShowRight}</UIButton>;
	}
}
