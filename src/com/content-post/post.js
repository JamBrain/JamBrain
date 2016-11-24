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

	getAvatar( user ) {
		return '//'+STATIC_DOMAIN + ((user && user.meta && user.meta.avatar) ? user.meta.avatar : '/other/dummy/user64.png');
	}
	
	getAtName( user ) {
		var user_url = '/users/'+user.slug+'/';
		return <NavLink class="at-name" href={user_url}><img src={this.getAvatar(user)} />{user.name}</NavLink>;
	}

	render( {node, user, path}, {author, error} ) {
		if ( node.slug && author.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			var url = path+node.slug+'/';
			
			var pub_date = new Date(node.published);
			var pub_diff = new Date().getTime() - pub_date.getTime();
			
			// x minutes ago
			var post_relative = <span class="if-sidebar-inline">{getRoughAge(pub_diff)}</span>;
			// simple date, full date on hover
			var post_date = <span>on <span class="-title" title={getLocaleDate(pub_date)}><span class="if-sidebar-inline">{getLocaleDay(pub_date)}</span> {getLocaleMonthDay(pub_date)}</span></span>;
			
			var post_by = <span>by {this.getAtName(author)}</span>;
			if ( author.meta['real-name'] ) {
				post_by = <span>by {author.meta['real-name']} ({this.getAtName(author)})</span>;
			}
			
			var post_avatar = this.getAvatar( author );
			
			return (
				<div class="content-base content-post">
					<div class="-header">
						<div class="-avatar"><img src={post_avatar} /></div>
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						<div class="-subtext">
							Posted {post_relative} {post_by} {post_date}
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
