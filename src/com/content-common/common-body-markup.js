import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

export default class ContentCommonBodyMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( props ) {
		// NOTE: only parses the first child
		var _body = props.children.length ? marked.parse(props.children[0]) : "";
		var _class = "content-common-body -markup markup" + (props.class ? " "+props.class : "");

		return <div class={_class} dangerouslySetInnerHTML={{__html:_body}} />;
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
