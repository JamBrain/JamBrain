import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import $Node							from '../../shrub/js/node/node';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			author: {}
		};
		
		this.componentWillReceiveProps( props );
	}
	
	componentWillReceiveProps( props ) {
		// Clear the Author
		this.setState({ author: {} });
		
		// Lookup the author
		$Node.Get( props.node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				this.setState({ author: r.node[0] });
			}
			else {
				this.setState({ error: "Not found" });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}

//	componentDidMount() {
//	}
//	componentWillUnmount() {
//	}

	render( {node, user, path}, {author, error} ) {
		if ( node.slug && author.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			var url = path+node.slug+'/';
			
			// x minutes ago
			var relative_time = <span></span>;//<span class="-time">{node.published}</span> ago
			// simple date, full date on hover
			var post_date = <span>on <span class="-title" title={node.published}>{node.published}</span></span>;
			var post_by = <span>by {author.slug}</span>;
			
			var avatar = '//'+STATIC_DOMAIN + ((author.meta && author.meta.avatar) ? author.meta.avatar : '/other/dummy/user64.png');
			
			var hasTwitter = <span></span>;
			
			return (
				<div class="content-base content-post">
					<div class="-header">
						<div class="-avatar"><img src={avatar} /></div>
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						<div class="-subtext">
							Posted {relative_time} {post_date}, {post_by} {hasTwitter}
						</div>
					</div>
					<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
					<div class="-footer">
						<div class="-left">
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
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}
}

//							<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>

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
