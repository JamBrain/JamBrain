import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class ContentCommentsMarkup extends Component {
	constructor( props ) {
		super(props);
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
		this.resizeTextarea();
	}
	
	render( props ) {
		var Class = [
//			"content-common-body",
			"-markup"
		];
		if ( typeof props.class == 'string' ) {
			Class = Class.concat(props.class.split(' '));
		}

		if (props.editing) {
			var Height = this.textarea ? this.textarea.scrollHeight : 0;
			
			var Limit = props.limit ? props.limit : 4096;
			var Chars = props.children[0] ? props.children[0].length : 0;
			
			return (
				<div class={Class}>
					<div class="-label">{props.label}</div>
					<div class="-textarea">
						<textarea 
							name="paragraph_text" 
							value={props.children} 
							oninput={props.onmodify} 
							placeholder={props.placeholder} 
							ref={(input) => { this.textarea = input; }} 
							maxlength={Limit}
						/>
					</div>
					<div class="-footer">
						<div class="-right"><span class="-chars">{Chars}</span>/<span class="-limit">{Limit}</span></div>
						<div class="-left">Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> <strong>Markdown</strong></NavLink> and <NavLink href="//emoji.codes/"><strong>:emoji_codes:</strong></NavLink></div>
					</div>
				</div>
			);
		}
		else {
			Class.push("markup");

			// NOTE: only parses the first child
			var Text = props.children.length ? marked.parse(props.children[0]) : "";

			return <div class={Class} dangerouslySetInnerHTML={{__html:Text}} />;
		}
	}
}
