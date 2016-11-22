import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
	}

	render( { node, user }, state ) {
		if ( node.body ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			var url = "//";
			
			// x minutes ago
			var relative_time = <span></span>;//<span class="-time">{node.published}</span> ago
			// simple date, full date on hover
			var post_date = <span>on <span class="-title" title={node.published}>{node.published}</span></span>;
			var post_by = <span>by {node.author}</span>;
			
			var hasTwitter = <span></span>;
			
			return (
				<div class="content-base content-post">
					<div class="-header">
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						<div class="-subtext">
							Posted {relative_time} {post_date}, {post_by} {hasTwitter}
						</div>
					</div>
					<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
					<div class="-footer">
						<div class="-left">
							<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>
						</div>
						<div class="-right">
						</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-post">
					Please Wait...
				</div>
			);
		}
	}

	componentDidMount() {
	}
	componentWillUnmount() {
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
