import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';
import InputTextArea					from 'com/input-textarea/input-textarea';

import marked 								from '../../internal/marked/marked';

export default class ContentCommentsMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}

	render( props ) {
		var Class = [
//			"content-common-body",
//			"-markup"
		];

		var Text = props.children.join('');

		if (props.editing) {
			//var Height = this.textarea ? this.textarea.scrollHeight : 0;

			var Limit = props.limit ? props.limit : 4096;
			//var Chars = props.children[0] ? props.children[0].length : 0;

			return (
				<div class={cN(Class, props.class)}>
					<div class="-label">{props.label}</div>
					<InputTextArea
						user={props.user}
						value={Text}
						onmodify={props.onmodify}
						placeholder={props.placeholder}
						ref={(input) => { this.textarea = input; }}
						maxlength={Limit}
					/>
				</div>
			);
		}
		else {
			Class.push("-markup");
			Class.push("markup");

			// NOTE: only parses the first child
			//var Text = props.children.length ? marked.parse(props.children[0]) : "";
			Text = marked.parse(Text);

			var markedOptions = {
				highlight: function(code, lang) {
					var language = Prism.languages.clike;
					if (Prism.languages[lang])
						language = Prism.languages[lang];
					return Prism.highlight(code, language);
				},
				sanitize: true, // disable HTML
				smartypants: true, // enable automatic fancy quotes, ellipses, dashes
				langPrefix: 'language-'
			};

			// NOTE: only parses the first child
			//var Text = props.children.length ? marked.parse(props.children[0]) : "";
			var mrkd = new marked();
			markdown = mrkd.parse(Text, markedOptions);

			return <div class={cN(Class, props.class)}>{markdown}</div>;
		}
	}
}
