import {h, Component} 				from 'preact/preact';
import UIButton						from 'com/ui/button/button';
import marked 						from 'internal/marked/marked';


class Autocompletions extends Component {
	constructor( props ) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	onKeyDown( e ) {
		const {editMode} = this.state;
		if ( !editMode ) {
			return true;
		}
		switch ( e.key ) {
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
			case "Tab":
				this.selectSelected();
				return false;
		}
		return true;
	}

	componentDidMount() {
		this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps( nextProps ) {
		let {text, cursorPos, textareaFocus} = nextProps;
		cursorPos = cursorPos ? cursorPos : 0;
		if ( !textareaFocus ) {
			text = text ? text : '';
			//console.log("No focus", textareaFocus, text.substr(0, cursorPos) + '|' + text.substr(cursorPos));
			this.setState({'match': null, 'cursorPos': cursorPos, 'editMode': false, 'text': text});
		}
		else if ( text ) {
			const matchObj = this.getMatch(text, cursorPos);
			// console.log('Autocomplete props', matchObj, `'${this.state.selected}'`, text.substr(0, cursorPos) + '|' + text.substr(cursorPos));
			if ( matchObj ) {
				const editMode = (text !== this.state.text) || this.state.editMode;
				//console.log('Matching', matchObj, editMode, `'${this.state.selected}'`, text.substr(0, cursorPos) + '|' + text.substr(cursorPos));
				this.setState({
					'editMode': editMode,
					'text': text,
					'cursorPos': cursorPos,
					'match': matchObj.match,
					'matchStart': matchObj.matchStart,
					'matchEnd': matchObj.matchEnd,
					'matchEndNewLine': matchObj.matchEndNewLine
				});
			}
			else {
				this.setState({'match': null, 'cursorPos': cursorPos, 'editMode': false, 'text': text});
			}
		}
		else {
			this.setState({'match': null, 'cursorPos': cursorPos, 'editMode': false, 'text': text});
		}
	}

	getMatch( text, cursorPos ) {
		const {startPattern, endPattern} = this.state;
		const left = text.slice(0, cursorPos).match(startPattern);
		//console.log('Matching:', text, '|', left);
		if ( !left ) {
			return null;
		}
		const right = text.slice(cursorPos).match(endPattern);
		const endsInNewline = right && right[2] == '\n';
		//console.log(left, right);
		return {
			'match': left[2] + (right ? right[0] : ''),
			'matchStart': cursorPos - left[2].length,
			'matchEnd': cursorPos + (right ? right[0].length : 0),
			'matchEndNewLine': endsInNewline,
		};
	}

	selectSelected() {
		const {match, editMode, matchStart, matchEnd} = this.state;
		if ( !editMode ) {
			return;
		}
		let {selected} = this.state;
		selected = this.getOptions(selected ? selected : match).sort((a, b) => b.score - a.score)[0].slug;
		this.executeSelect(selected);
	}

	handleSelect( item, e ) {
		/* Bind per element so that the match/item is the first argument.
		*/
		const {editMode} = this.state;
		if ( !editMode ) {
			return;
		}

		this.executeSelect(item.slug);
	}

	executeSelect( selected ) {
		const {matchStart, matchEnd, match, matchEndNewLine} = this.state;
		const {onSelect, text} = this.props;
		selected = selected + ' ' + (matchEndNewLine ? '\n' : '');
		const updatedText = text.slice(0, matchStart) + selected + text.slice(matchEnd);
		this.setState({'text': updatedText, 'selected': null, 'editMode': false});
		if ( onSelect ) {
			onSelect(updatedText, matchStart + selected.length - (matchEndNewLine ? 1: 0));
		}
	}

	updateSelected( indexChange ) {
		const {selectedIndex, options} = this.getSelected();
		let nextIndex = selectedIndex + indexChange;
		if ( nextIndex < 0 ) {
			nextIndex = options.length - 1;
		}
		else {
			nextIndex %= options.length;
		}
		if ( nextIndex < options.length ) {
			this.setState({'selected': options[nextIndex].slug});
		}
	}

	handleAbort() {
		this.setState({'selected': null, 'editMode': false});
	}

	getOptions( hint ) {
		/* Should return an array of objects that contains the
		fields `name` and `score`. Could have more fields if useful for the render function and callbacks.
		Name should be the exact word that is expected to be written in
		the input if option is selected.
		*/
		return [];
	}

	renderSuggestion( item, classModifier ) {
		/* Should return a JSX element rendering the option
		*/
		return null;
	}

	getSelected() {
		const {match, selected} = this.state;
		let {maxItems} = this.state;
		if ( !maxItems ) {
			maxItems = 4;
		}
		let selectedIndex = selected ? -1 : 0;
		const options = this.getOptions(match).sort((a, b) => b.score - a.score).slice(0, maxItems);
		if ( options ) {
			const selectedMatch = options.map((opt, i) => [opt, i]).filter(item => item[0].slug == selected);
			if ( selectedMatch.length == 1 ) {
				selectedIndex = selectedMatch[0][1];
			}
		}
		return {'selected': selected, 'selectedIndex': selectedIndex, 'options': options};
	}

	render( props, state ) {
		const {editMode, match, name} = state;
		let {maxItems, selected} = state;
		if ( editMode && match && (match != selected) ) {
			let {selected, options, selectedIndex} = this.getSelected();
			if ( (options.length > 0) && (!selected || (selectedIndex < 0)) ) {
				selected = options[0].slug;
				if ( selectedIndex < 0 ) {
					this.setState({'selected': selected});
				}
			}
			if ( selected ? ((options.length > 1) || ((options.length == 1) && (options[0].name != match) && (match != selected))) : (options.length > 0) ) {
				props.captureKeyDown(name, this.onKeyDown);
				return (
					<div class={cN("-auto-complete", props.class)}>
						{options.map((m, i) => this.renderSuggestion(m, i == selectedIndex ? '-selected' : ''))}
					</div>
				);
			}
			else {
				props.captureKeyDown(name, null);
				this.setState({'editMode': false});
			}
		}
	}
}

export class AutocompleteEmojis extends Autocompletions {
	constructor( props ) {
		super(props);
		this.state = {
			'name': 'emojis',
			'startPattern': /(\s| |^)(:[A-Za-z-_0-9]*)$/,
			'endPattern': /^([A-Za-z-_0-9]*:?)( +|$|\n)/,
			'maxItems': 8,
			'mrkd': new marked(),
		};
	}

	getOptions( hint ) {
		const {emojiList} = window.emoji;
		const options = [];
		const matcher = new RegExp(hint ? hint.trim().substr(1).replace(':', '').replace('-', '_') : '', 'i');
		for ( let emoji in emojiList ) {
			const matches = matcher.exec(emoji);
			if ( (hint.length == 0) || matches ) {
				const matchStart = matches ? (emoji.indexOf(matches[0]) + 1) : 0;
				const matchEnd = matches ? (matchStart + matches[0].length) : 0;
				let score = (matchStart == 0) ? 0.5 : 1;
				score = Math.pow(hint.length / emoji.length, score);
				options.push({
					'name': ':' + emoji + ':',
					'slug': ':' + emoji + ':',
					'score': score,
					'matchStart': matchStart,
					'matchEnd': matchEnd,
				});
			}
		}
		return options;
	}

	renderSuggestion( item, classModifier ) {
		const {matchStart, matchEnd, name} = item;
		let ShowLeft = null;
		let ShowMatch = null;
		let ShowRight = null;
		if ( matchEnd != matchStart ) {
			ShowLeft = name.substr(0, matchStart);
			ShowMatch = <b>{name.substr(matchStart, matchEnd - matchStart)}</b>;
			ShowRight = name.substr(matchEnd);
		}
		else {
			ShowLeft = name;
		}
		const {mrkd} = this.state;
		const ShowEmoji = mrkd.parse(name, {});

		return (
			<UIButton key={name} class={cN(classModifier)} onclick={this.handleSelect.bind(this, item)}>
				<div class="-emoji-autocomplete-markup">{ShowEmoji}</div>{ShowLeft}{ShowMatch}{ShowRight}
			</UIButton>);
	}
}

export class AutocompleteAtNames extends Autocompletions {
	constructor( props ) {
		super(props);
		this.state = {
			'name': 'at-names',
			'startPattern': /(\s| |^)(@[A-Za-z-_0-9]*)$/,
			'endPattern': /^([A-Za-z-_0-9]*)( +|$|\n)/,
			'maxItems': 8,
		};
	}

	getOptions( hint ) {
		const {authors} = this.props;
		const options = [];
		const matcher = new RegExp(hint ? hint.trim().substr(1) : '', 'i');
		if ( authors ) {
			for ( let author in authors ) {
				const authorData = authors[author];
				const matches = matcher.exec(authorData.slug);
				if ( (hint.length == 0) || matches ) {
					const matchStart = matches ? (authorData.slug.indexOf(matches[0]) + 1) : 0;
					const matchEnd = matches ? (matchStart + matches[0].length) : 0;
					let score = (matchStart == 0) ? 0.5 : 1;
					score = Math.pow(hint.length / authorData.name.length, score);
					options.push({
						'name': '@' + authorData.name,
						'slug': '@' + authorData.slug,
						'score': score,
						'matchStart': matchStart,
						'matchEnd': matchEnd,
					});
				}
			}
		}
		return options;
	}

	renderSuggestion( item, classModifier ) {
		const {matchStart, matchEnd, name} = item;
		let ShowLeft = null;
		let ShowMatch = null;
		let ShowRight = null;
		if ( matchStart != matchEnd ) {
			ShowLeft = name.substr(0, matchStart);
			ShowMatch = <b>{name.substr(matchStart, matchEnd - matchStart)}</b>;
			ShowRight = name.substr(matchEnd);
		}
		else {
			ShowLeft = name;
		}
		return <UIButton key={name} class={cN(classModifier)} onclick={this.handleSelect.bind(this, item)}>{ShowLeft}{ShowMatch}{ShowRight}</UIButton>;
	}
}
