import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputTextarea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'cursorPos': (props.value || '').length,
			'edge': /Edge/.test(navigator.userAgent)
		};
		
		this.onInput = this.onInput.bind(this);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	resizeTextarea() {
		if ( this.textarea ) {
			this.textarea.style.height = 0;	/* Shockingly, this is necessary. textarea wont shrink otherwise */
			this.textarea.style.height = this.textarea.scrollHeight + 'px';
		}		
	}
	
	// After initial render
	componentDidMount() {
		this.resizeTextarea();
	}
	
	// After every update
	componentDidUpdate() {
		if ( this.textarea && this.state.edge ) {
			this.textarea.setSelectionRange(this.state.cursorPos, this.state.cursorPos);
		}

		this.resizeTextarea();
	}
	
	onInput( e ) {
		if ( this.props.onmodify ) {
			this.props.onmodify(e);
		}
		
		if( this.state.edge ) {
			e.preventDefault();
			this.setState({'cursorPos': e.target.selectionEnd});
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
						ref={(input) => { this.textarea = input; }} 
					/>
				</div>
				<div class="-footer">
					{ShowLimit}
					<div class="-left if-sidebar-block">Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> <strong>Markdown</strong></NavLink> and <NavLink href="//emoji.codes/"><strong>:emoji_codes:</strong></NavLink></div>
				</div>
			</div>
		);
	}
}
