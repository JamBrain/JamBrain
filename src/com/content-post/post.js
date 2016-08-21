import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink 			from 'com/nav-link/link';

export default class ContentPost extends Component {
	render(props,state) {
		props.title = (props.post && props.post.title) ? props.post.title : props.title;
		props.user = props.user ? props.user : {};
		
		var hasTwitter = props.user.twitter ? <span class="-twitter"> (<a href={"https://twitter.com/"+props.user.twitter} target="_blank" title={"https://twitter.com/"+props.user.twitter}><SVGIcon baseline small>twitter</SVGIcon>/{props.user.twitter}</a>)</span> : <span />;
		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <SVGIcon>users</SVGIcon></span> : <span />;
		
		// Build URL //
		// TODO: append trailing '/' to base if missing
		var url = props.slug+'/';
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

		var parsedBody = marked.parse(props.body);
		var dangerParsedBody = { __html:parsedBody };
		
		var avatar = props.user.avatar ? "//"+STATIC_DOMAIN+props.user.avatar : "";
		
		return (
			<div class="content-base content-post">
				<div class="-header">
					<div class="-avatar"><img src={avatar} /></div>
					<div class="-title _font2"><NavLink href={url}>{props.title}</NavLink></div>
					<div class="-subtext">
						Posted <span class="-time">{props.relative_time}</span> ago
						on <span class="-title" title={props.date}>{props.short_date}</span>,
						by <span class="-name"><NavLink href={'/u/'+props.user.slug+'/'} class="-author" title={'@'+props.user.slug}><img style="height:0.8em;padding-right:0.1em;" src={avatar} />{props.user.name}</NavLink></span>
						{hasTwitter}
						{hasTeam}
					</div>
				</div>
				<div class="-body markup" dangerouslySetInnerHTML={dangerParsedBody} />
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
						<div class="-gear"><SVGIcon>cog</SVGIcon></div>
					</div>
				</div>
			</div>
		);
	}
	// body: unmagin-top, unmargin-bottom. replace with selector
//						<div class="-spacer2"><SVGIcon>wedge-right</SVGIcon></div>
	
	componentDidMount() {
	}
	componentWillUnmount() {
	}
}
