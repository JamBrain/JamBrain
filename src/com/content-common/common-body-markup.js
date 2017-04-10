import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class ContentCommonBodyMarkup extends Component {
	constructor( props ) {
		super(props);

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
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	componentDidUpdate() {
		if ( this.textarea ) {
			this.textarea.style.height = 0;	/* Shockingly, this is necessary. textarea wont shrink otherwise */
			this.textarea.style.height = this.textarea.scrollHeight + 'px';
		}
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
					<div class="-footer">Supports <NavLink blank href="/markdown"><SVGIcon>markdown</SVGIcon> <strong>Markdown</strong></NavLink> and <NavLink href="//emoji.codes/"><strong>:emoji_codes:</strong></NavLink></div>
				</div>
			);
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
	langPrefix: 'language-',
});
