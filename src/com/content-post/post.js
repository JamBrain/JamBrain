import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class ContentPost extends Component {
	render(props,state) {
		props.title = (props.post && props.post.title) ? props.post.title : props.title;
		props.user = props.user ? props.user : {};
		
		var hasTwitter = props.user.twitter ? <span class="-twitter"> (<SVGIcon name="twitter" /> {props.user.twitter})</span> : <span />;
		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <SVGIcon name="users" /></span> : <span />;
		
		return (
			<div class="content-item content-post">
				<div class="-header">
					<div class="-avatar"><img src={props.user.avatar ? "//"+STATIC_DOMAIN+props.user.avatar : ""} /></div>
					<div class="-title _font2">{props.title}</div>
					<div class="-subtext">
						Posted <span class="-time">{props.relative_time}</span> ago
						on <span class="-title" title={props.date}>{props.short_date}</span>,
						by <span class="-name">{props.user.name}</span>
						{hasTwitter}
						{hasTeam}
					</div>
				</div>
				<div class="-body">
					{props.children}
				</div>
				<div class="-footer">
					<div class="-left">
						<div class="-minmax"><SVGIcon name="arrow-up" /></div>
						<div class="-edge"><SVGIcon name="wedge-left" /></div>
					</div>
					<div class="-right">
						<div class="-edge"><SVGIcon name="wedge-right" /></div>
						<div class="-heart"><SVGIcon name="heart" /></div>
						<div class="-heart-count">151</div>
						<div class="-spacer"><SVGIcon name="wedge-right" /></div>
						<div class="-comment"><SVGIcon name="bubbles" /></div>
						<div class="-comment-count">204</div>
						<div class="-spacer2"><SVGIcon name="wedge-right" /></div>
						<div class="-gear"><SVGIcon name="cog" /></div>
					</div>
				</div>
			</div>
		);
	}
	// (<SVGIcon name="twitter" /> <a href="http://twitter.com/mikekasprzak">mikekasprzak</a>)
	// of <em>Team Fishbowl</em> <SVGIcon name="users" />
	// body: unmagin-top, unmargin-bottom. replace with selector
	
	componentDidMount() {
	}
	componentWillUnmount() {
	}
}
