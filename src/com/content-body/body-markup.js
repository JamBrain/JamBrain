import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';
import marked 								from '../../internal/marked/marked';

export default class ContentBodyMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		var mrkd = new marked();

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
		var _body = props.children.length ? mrkd.parse(props.children[0], markedOptions) : "";

		// '-body' for backwards compatibility (remove me)
		var _class = "content-body content-body-markup -body markup" + (props.class ? " "+props.class : "");

		// NOTE: only parses the first child
		//var Text = props.children.length ? marked.parse(props.children[0]) : "";
		markdown = mrkd.parse(_body, markedOptions);

		return (<div class={_class}>{markdown}</div>);
	}
}
