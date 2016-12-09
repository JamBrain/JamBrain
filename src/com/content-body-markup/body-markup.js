import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

export default class ContentBodyMarkup extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props.children, nextProps.children);
	}

	render( {children} ) {
		// NOTE: Only supports the first child
		var body = marked.parse(children.length ? children[0] : "");
		
		// '-body' for backwards compatibility (remove me)
		return <div class="content-body-base content-body-markup -body markup" dangerouslySetInnerHTML={{__html:body}} />;
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
