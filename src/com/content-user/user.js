import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

export default class ContentUser extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	componentWillUnmount() {
	}
	
	render( {node}, {error} ) {
		if ( node.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse('**User:** '+node.name) };
			
			var avatar = '//'+STATIC_DOMAIN + ((node.meta && node.meta.avatar) ? node.meta.avatar : '/other/dummy/user64.png');
			
			var url = '/users/'+node.slug+'/';
			
			return (
				<div class="content-base content-user">
					<div class="-header">
						<div class="-avatar"><img src={avatar} /></div>
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
					</div>
					<div class="-body"><div><SVGIcon>user-plus</SVGIcon> Follow</div></div>
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

//							<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>
//							<div class="-edge"><SVGIcon>wedge-left</SVGIcon></div>

//							<div class="-edge"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-heart"><SVGIcon>heart-check</SVGIcon></div>
//							<div class="-text -heart-count">0</div>
//							<div class="-spacer"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-comment"><SVGIcon>bubble-empty</SVGIcon></div>
//							<div class="-text -comment-count">0</div>
//							<div class="-spacer2"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-gear"><SVGIcon>cog</SVGIcon></div>

/*
		var user = props.node;//CoreData.getNodeById( props.node );
		
		var hasTwitter = user.meta.twitter ? <span class="-twitter"> (<a href={"https://twitter.com/"+user.meta.twitter} target="_blank" rel="noopener noreferrer" title={"https://twitter.com/"+user.meta.twitter}><SVGIcon baseline small>twitter</SVGIcon>/{user.meta.twitter}</a>)</span> : <span />;
//		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <SVGIcon>users</SVGIcon></span> : <span />;
		
		// Build URL //
		// TODO: append trailing '/' to base if missing
		var url = '/u/'+user.slug+'/';
		// TODO: if single post mode, prefix with '../'
		
//		function parseNames( str ) {
//			// Dummy: Use Global Object //
//			var users = {
//				'pov': {
//					name:'PoV',
//					slug:'pov',
//					avatar:'/other/logo/mike/Chicken64.png',
//					twitter:'mikekasprzak',
//				}
//			};
//			
//			return str.replace(/@([A-Za-z][A-Za-z0-9-]*)/g,function(original,p1,offset,s) {
//				//console.log(match,p1,offset);
//				var name = p1.toLowerCase();
//				if ( users[name] ) {
//					return "<span class='inline-name'><img src='//"+STATIC_DOMAIN+users[name].avatar+"'><a href='/u/"+users[name].slug+"'>"+users[name].name+"</a></span>";
//				}
//				else {
//					return original;
//				}
//			});
//			
//			// TODO: attach the Navigation link code to the <a> tag above //
//		}

		var dangerousParsedBody = { __html:marked.parse(user.body) };
		var dangerousParsedTitle = { __html:titleParser.parse(user.name) };
		
		var avatar = user.meta.avatar ? "//"+STATIC_DOMAIN+user.meta.avatar : "";
		
		return (
			<div class="content-base content-user">
				<div class="-header">
					<div class="-avatar"><img src={avatar} /></div>
					<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
				</div>
				<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
				<div class="-footer">
					<div class="-left">
						<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>
						<div class="-edge"><SVGIcon>wedge-left</SVGIcon></div>
					</div>
					<div class="-right">
						<div class="-edge"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-heart"><SVGIcon>heart-check</SVGIcon></div>
						<div class="-text -heart-count">0</div>
						<div class="-spacer"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-comment"><SVGIcon>bubble-empty</SVGIcon></div>
						<div class="-text -comment-count">0</div>
						<div class="-spacer2"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-gear"><SVGIcon>cog</SVGIcon></div>
					</div>
				</div>
			</div>
		);
	}
	// body: unmagin-top, unmargin-bottom. replace with selector
*/	
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
