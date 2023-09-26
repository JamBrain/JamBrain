import {Component, toChildArray} 	from 'preact';
import {Diff}	 				from 'shallow';
import marked 							from 'internal/marked/marked';

export default class ContentBodyMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return Diff(toChildArray(this.props.children), toChildArray(nextProps.children));
	}

	render( props ) {
		let md = new marked();

		const markedOptions = {
			'highlight': function(code, lang) {
				var language = Prism.languages.clike;
				if (Prism.languages[lang])
					language = Prism.languages[lang];
				return Prism.highlight(code, language);
			},
			'sanitize': true, // disable HTML
			'smartypants': true, // enable automatic fancy quotes, ellipses, dashes
			'showLinks': !props.untrusted,
			'langPrefix': 'language-'
		};

		// NOTE: only parses the first child
		let _body = toChildArray(props.children).length ? md.parse(toChildArray(props.children)[0], markedOptions) : "";

		// '-body' for backwards compatibility (remove me)
		let _class = `content-body content-body-markup -body markup ${props.class ?? ''}`;

		return (<div class={_class}>{md.parse(_body, markedOptions)}</div>);
	}
}
