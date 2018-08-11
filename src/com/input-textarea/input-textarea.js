import {h, Component} 					from 'preact/preact';
import Shallow			 				from 'shallow/shallow';

import NavLink							from 'com/nav-link/link';
import ButtonLink						from 'com/button-link/link';
import SVGIcon							from 'com/svg-icon/icon';

import $Asset							from 'shrub/js/asset/asset';


export default class InputTextarea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'cursorPos': (props.value || '').length,
			'microsoftEdge': /Edge/.test(navigator.userAgent),
			'prevHeight': -1,	// This allows us to not scroll adjust wrong on first change
		};

		this.onInput = this.onInput.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onClick = this.onClick.bind(this);

		//Needs to not be state and not trigger renders
		this.replaceTextEvent = -1;
	}

	shouldComponentUpdate( nextProps ) {
		return Shallow.Diff(this.props, nextProps);
	}

	componentWillReceiveProps(nextProps) {
		let {replaceText, cursorPos, replaceTextEvent, maxlength} = nextProps;
		const prevReplaceTextEvent = this.replaceTextEvent;
		this.props.value = replaceText;
		// console.log(!!replaceText, this.textarea, replaceTextEvent, prevReplaceTextEvent);
		if ( replaceText && this.textarea && (replaceTextEvent != prevReplaceTextEvent) ) {
			const {oncaret, onmodify} = this.props;
			let updated = false;
			if (maxlength && replaceText.length > maxlength) {
				replaceText = this.textarea.value;
				updated = true;
			}
			this.textarea.value = replaceText;
			this.textarea.focus();
			this.replaceTextEvent = replaceTextEvent;

			if (updated && onmodify) {
				onmodify({
					'target': {
						'value': replaceText, 'selectionStart': cursorPos, 'selectionEnd': cursorPos
					},
				});
			}
			this.textarea.selectionStart = cursorPos;
			this.textarea.selectionEnd = cursorPos;
			if (oncaret) {
				oncaret({
					'target': {
						'value': replaceText, 'selectionStart': cursorPos, 'selectionEnd': cursorPos
					},
					'key': 'ImaginaryKey'});
			}
		}
	}

	resizeTextarea() {
		// Reference: http://stackoverflow.com/a/18262927/5678759
		// Reference: https://quirksmode.org/dom/core/
		// Reference: https://quirksmode.org/dom/w3c_cssom.html#windowview

		if ( this.textarea ) {
			var scrollLeft = window.pageXOffset;// || document.documentElement.scrollLeft; // pageXOffset is IE 9+
			var scrollTop = window.pageYOffset;// || document.documentElement.scrollTop;  // pageYOffset is IE 9+

			//			window.onscroll = function() {}; // I don't think this has any effect

			this.textarea.style.height = 0;	// Shockingly, this is necessary. textarea wont shrink otherwise.

			// Unfortunately if the textarea is larger than the screen, this `= 0` line causes the focus to jump to the top of the textarea.
			this.textarea.style.height = this.textarea.scrollHeight + 'px';

			// Calculate the size change since last time here
			var delta = (this.state.prevHeight > 0) ? (this.textarea.scrollHeight - this.state.prevHeight) : 0;

			// This works around the jumping by restoring the scroll positions to where they should have been
			window.scrollTo(scrollLeft, scrollTop + delta);

//			window.onscroll = null;

			//Save current height for next round
			this.state.prevHeight = this.textarea.scrollHeight;
		}
	}

	// After initial render
	componentDidMount() {
		this.resizeTextarea();
	}

	// After every update
	componentDidUpdate() {
		if ( this.textarea && this.state.microsoftEdge ) {
			this.textarea.setSelectionRange(this.state.cursorPos, this.state.cursorPos);
		}

		this.resizeTextarea();
	}

	insertAtCursor( Text ) {
		var ta = this.textarea;

		// http://stackoverflow.com/a/11077016/5678759
		if ( ta.selectionStart || (ta.selectionStart == '0') ) {	// Is Number
			var startPos = ta.selectionStart;
			var endPos = ta.selectionEnd;
			ta.value = ta.value.substring(0, startPos) + Text + ta.value.substring(endPos, ta.value.length);
		}
		else {
			this.props.value += Text;
		}
	}

	// how to preview too
	// https://codepen.io/hartzis/pen/VvNGZP

	onFileChange( e ) {
		if ( !this.props.user )
			return null;
		if ( e.target.files && e.target.files.length ) {
			var file = e.target.files[0];

			return $Asset.Upload(this.props.user.id, file)
				.then( r => {
					if ( r.path ) {
						this.insertAtCursor('!['+r.name+'](///raw/'+r.path+')');
						this.textarea.dispatchEvent( new Event('input') );
					}
					else {
						console.error("Unable to upload image.");
						window.location.hash = "#error-upload/"+encodeURI(r.message);
						//alert(r.message);
					}
				})
				.catch(err => {
					console.error("Unable to upload image.");
					window.location.hash = "#error-upload";
					//this.setState({ 'error': err });
				});
		}
	}

	onInput( e ) {
		if ( this.props.onmodify ) {
			this.props.onmodify(e);
		}

		if ( this.state.microsoftEdge ) {
			e.preventDefault();
			this.setState({'cursorPos': e.target.selectionEnd});
		}
	}

	onKeyDown( e ) {
		const {onkeydown, oncaret} = this.props;
		if ( onkeydown && !onkeydown(e) ) {
			e.preventDefault();
		}
	}

	onKeyUp( e ) {
		const {onkeyup, oncaret} = this.props;
		if ( onkeyup && !onkeyup(e) ) {
			e.preventDefault();
		}
		else if (oncaret) {
			switch (e.key) {
				case "ArrowUp":
				case "ArrowDown":
				case "ArrowLeft":
				case "ArrowRight":
				case "Home":
				case "End":
				case "PageUp":
				case "PageDown":
					if (!oncaret(e)) {
						e.preventDefault();
					}
					break;
			}
		}
	}

	onBlur( e ) {
		const {onblur} = this.props;
		if ( onblur && !onblur(e) ) {
			e.preventDefault();
		}
	}

	onFocus( e ) {
		const {onfocus, oncaret} = this.props;
		if ( onfocus && !onfocus(e) ) {
			e.preventDefault();
		}
		if ( oncaret && !oncaret(e) ) {
			e.preventDefault();
		}
	}

	onClick( e ) {
		const {oncaret} = this.props;
		if ( oncaret && !oncaret(e) ) {
			e.preventDefault();
		}
	}

	render( props ) {
		var ShowLimit = null;
		if ( props.maxlength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxlength}</span></div>;

		return (
			<div class="input-textarea">
				<div class="-textarea">
					<textarea {...props}
						oninput={this.onInput}
						onkeydown={this.onKeyDown}
						onkeyup={this.onKeyUp}
						onclick={this.onClick}
						ref={(input) => { this.textarea = input; }}
					/>
				</div>
				<div class="-footer">
					{ShowLimit}
					<div class="-left">
						<label>
							<input type="file" name="asset" style="display: none;" onchange={this.onFileChange} />
							<NavLink class="-upload"><SVGIcon baseline gap>upload</SVGIcon>Upload Image</NavLink>
						</label>
						<span class="if-sidebar-inline">. Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> Markdown</NavLink> and <strong>:emoji_codes:</strong></span>
					</div>
				</div>
			</div>
		);
//						<NavLink class="-upload" onclick={e => {window.location = "#upload";}}><SVGIcon baseline gap>upload</SVGIcon>Upload</NavLink>

//		<NavLink class="-upload" href="#upload"><SVGIcon baseline gap>upload</SVGIcon>Upload</NavLink>
//		<span class="-upload" onclick={e => {window.location = "#upload";}}><SVGIcon baseline gap>upload</SVGIcon>Upload</span>
	}
}
