import {h, Component} from 'preact';
import Shallow from 'shallow/shallow';

import NavLink from 'com/nav-link/link';
import ButtonLink from 'com/button-link/link';
import UIIcon from 'com/ui/icon';

import $Asset from 'shrub/js/asset/asset';		// For image uploading


export default class UITextarea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'cursorPos': (props.value || '').length,
			// MK: Chrome dev tools discourage the use of userAgent
			// MK: Also, since Edge is Chromium based this might not be needed
			//'microsoftEdge': /Edge/.test(navigator.userAgent),
			//'prevHeight': -1	// This allows us to not scroll adjust wrong on first change
		};

		this.onInput = this.onInput.bind(this);
		this.onFileChange = this.onFileChange.bind(this);

		this.prevHeight = -1;
	}

	shouldComponentUpdate( nextProps ) {
		return Shallow.Diff(this.props, nextProps);
	}

	resizeTextarea() {
		// Reference: http://stackoverflow.com/a/18262927/5678759
		// Reference: https://quirksmode.org/dom/core/
		// Reference: https://quirksmode.org/dom/w3c_cssom.html#windowview

		if ( this.textarea ) {
			var scrollLeft = window.pageXOffset;// || document.documentElement.scrollLeft; // pageXOffset is IE 9+
			var scrollTop = window.pageYOffset;// || document.documentElement.scrollTop;  // pageYOffset is IE 9+

			//			window.onscroll = function() {}; // I don't think this has any effect

			this.textarea.style.height = "0";	// Shockingly, this is necessary. textarea wont shrink otherwise.

			// Unfortunately if the textarea is larger than the screen, this `= 0` line causes the focus to jump to the top of the textarea.
			this.textarea.style.height = this.textarea.scrollHeight + 'px';

			// Calculate the size change since last time here
			var delta = this.prevHeight > 0 ? this.textarea.scrollHeight - this.prevHeight : 0;

			// This works around the jumping by restoring the scroll positions to where they should have been
			window.scrollTo(scrollLeft, scrollTop + delta);

//			window.onscroll = null;

			//Save current height for next round
			this.prevHeight = this.textarea.scrollHeight;
		}
	}

	// After initial render
	componentDidMount() {
		this.resizeTextarea();
	}

	// After every update
	componentDidUpdate() {
		// MK: Disabled because Edge is now Chromium based
		/*
		if ( this.textarea && this.state.microsoftEdge ) {
			this.textarea.setSelectionRange(this.state.cursorPos, this.state.cursorPos);
		}
		*/

		this.resizeTextarea();
	}

	insertAtCursor( Text ) {
		var ta = this.textarea;

		// http://stackoverflow.com/a/11077016/5678759
		if ( ta.selectionStart || ta.selectionStart === 0) {	// Is Number
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
						alert(r.message);
					}
				})
				.catch(err => {
					this.setState({ 'error': err });
				});
		}
	}

	onInput( e ) {
		if ( this.props.onModify ) {
			this.props.onModify(e);
		}

		// MK: Disabled because Edge is now Chromium based
		/*
		if( this.state.microsoftEdge ) {
			e.preventDefault();
			this.setState({'cursorPos': e.target.selectionEnd});
		}
		*/
	}

	render( props ) {
		var ShowLimit = null;
		if ( props.maxLength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxLength}</span></div>;

		return (
			<div class="ui-textarea">
				<div class="-textarea">
					<textarea {...props}
						oninput={this.onInput}
						ref={(input) => { this.textarea = input; }}
					/>
				</div>
				<div class="-footer">
					{ShowLimit}
					<div class="-left">
						<label>
							<input type="file" name="asset" style="display: none;" onChange={this.onFileChange} />
							<NavLink class="-upload"><UIIcon baseline gap>upload</UIIcon>Upload</NavLink>
						</label>
						<span class="if-sidebar-inline">. Supports <NavLink blank href="/markdown"><UIIcon>markdown</UIIcon> Markdown</NavLink> and <NavLink href="//emoji.codes/">:emoji_codes:</NavLink></span>
					</div>
				</div>
			</div>
		);
	}
}
