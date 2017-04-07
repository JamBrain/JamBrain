import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

export default class ContentCommonBodyMarkup extends Component {
	constructor( props ) {
		super(props);
		
		this.PlaceholderText = ([
			"Use GitHub-style markup (**bold** _italics_ ~~del~~ `code`), and emoji codes :like_this: :smile:",
			"",
			"# This is a header",
			"",
			"* Item 1",
			"* Item 2",
			"",
			"```",
			"printf(\"Hello World\");",
			"```",
			"",
			"## Embed things by pasting a URL on a new line:",
			"",
			"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			""]).join("\n");
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
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
			return (
				<div class={Class}>
					<div class="-label"></div>
					<textarea name="paragraph_text" rows="18" value={props.children} oninput={props.onmodify} placeholder={this.PlaceholderText} />
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
});
