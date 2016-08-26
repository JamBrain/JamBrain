import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

import JammerCore		from '../../jammer-core/core';


export default class ContentPost extends Component {
	render(props,state) {
		var post = JammerCore.getItemById( props.item );
		var user = JammerCore.getItemById( post.author );
		
		var hasTwitter = user.meta.twitter ? <span class="-twitter"> (<a href={"https://twitter.com/"+user.meta.twitter} target="_blank" title={"https://twitter.com/"+user.meta.twitter}><SVGIcon baseline small>twitter</SVGIcon>/{user.meta.twitter}</a>)</span> : <span />;
//		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <SVGIcon>users</SVGIcon></span> : <span />;
		
		// Build URL //
		var url = '/'+JammerCore.getPathSlugsById( props.item ).slice(1).join('/')+'/';
		
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

		var dangerousParsedBody = { __html:marked.parse(post.body) };
		var dangerousParsedTitle = { __html:titleParser.parse(post.name) };
		
		var avatar = user.meta.avatar ? "//"+STATIC_DOMAIN+user.meta.avatar : "";
		
		return (
			<div class="content-base content-post">
				<div class="-header">
					<div class="-avatar"><img src={avatar} /></div>
					<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
					<div class="-subtext">
						Posted <span class="-time">{post.relative_time}</span> ago
						on <span class="-title" title={post.date}>{post.short_date}</span>,
						by <span class="-name"><NavLink href={'/u/'+user.slug+'/'} class="-author" title={'@'+user.slug}><img style="height:0.8em;padding-right:0.1em;" src={avatar} />{user.name}</NavLink></span>
						{hasTwitter}
					</div>
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
