import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';

export default class ContentCommonBodyMarkup extends Component {
	constructor( props ) {
		super(props);

//console.log(this);console.log(input);input.style.height = (input.scrollHeight)+"px"; 
//		
//		this.PlaceholderText = ([
//			"",
////			"Use GitHub-style markup (**bold** _italics_ ~~del~~ `code`), and emoji codes :like_this: :smile:",
////			"",
////			"# This is a header",
////			"",
////			"* Item 1",
////			"* Item 2",
////			"",
////			"```",
////			"printf(\"Hello World\");",
////			"```",
////			"",
////			"## Embed things by pasting a URL on a new line:",
////			"",
////			"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//			""]).join("\n");

		this.onTextChange = this.onTextChange.bind(this);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	onTextChange() {
		if ( this.textarea ) {
			this.textarea.style.height = 0;	/* Shockingly, this is necessary. textarea wont shrink otherwise */
			this.textarea.style.height = this.textarea.scrollHeight + 'px';
		}
	}
	
	componentDidUpdate() {
		this.onTextChange();
	}
	
	render( props ) {
		// NOTE: only parses the first child
		var Text = props.children.length ? marked.parse(props.children[0]) : "";
		var Class = [
			"content-common-body",
			"-markup"
		];
		if ( typeof props.class == 'string' ) {
			Class = Class.concat(props.class.split(' '));
		}

		if (props.editing) {
			var Height = this.textarea ? this.textarea.scrollHeight : 0;
			var Style = {'height': Height+'px'};
			
			return (
				<div class={Class}>
					<div class="-label">{props.label}</div>
					<div class="-textarea">
						<textarea 
							name="paragraph_text" 
							style={Style} 
							value={props.children} 
							oninput={props.onmodify} 
							placeholder={props.placeholder} 
							ref={(input) => { this.textarea = input; }} 
						/>
					</div>
					<div class="-footer">Use <strong>**markup**</strong> <em>_styles_</em>, and <NavLink href="//emoji.codes/">:emoji:</NavLink></div>
				</div>
			);

//							onkeyup={this.onTextChange}
		}
		else {
			Class.push("markup");

			return <div class={Class} dangerouslySetInnerHTML={{__html:Text}} />;
		}
	}
}

marked.setOptions({
	highlight: function( code, lang ) {
		var language = Prism.languages.clike;
		if ( Prism.languages[lang] )
			language = Prism.languages[lang];
		return Prism.highlight( code, language );
	},
	sanitize: true,			// disable HTML
	smartypants: true,		// enable automatic fancy quotes, ellipses, dashes
});
