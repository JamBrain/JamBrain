import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentEvent extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}
	
	render( {node, path, extra}, {error} ) {
		if ( node.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			var url = path+'/'+node.slug+'/';
			
			if ( extra.length && extra[0] === 'theme' ) {
				return (
					<div class="content-base content-user">
						<div class="-header">
							<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						</div>
						<div class="-body">Theme Selection</div>
						<div class="-footer">
						</div>
					</div>
				);				
			}
			else {
				return (
					<div class="content-base content-user">
						<div class="-header">
							<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						</div>
						<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
						<div class="-body">This is an <strong>Event</strong> page. Extra Args: {extra}</div>
						<div class="-footer">
						</div>
					</div>
				);
			}
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : "Please Wait..." }
				</div>
			);
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
	sanitize: true,			// disable HTML //
	smartypants: true,		// enable automatic fancy quotes, ellipses, dashes //
});
