import {h, Component}	 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavRoot extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

		var NewPath = '/'+ (extra ? extra.join('/') : '');
		var PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		if ( NewPath == '/' )
			NewPath = '/home';

		// TODO: Check if Jammer.vg vs ludumdare. Use different path on each
		let ShowEvents = null;
		if ( true ) {
			ShowEvents = <ContentNavButton path={PartPath} title="Winners" icon="trophy" href="/events/ludum-dare">Events</ContentNavButton>;
		}
		else {
			ShowEvents = <ContentNavButton path={PartPath} title="Winners" icon="trophy" href="/events">Events</ContentNavButton>;
		}

		return (
			<div class="content-base content-nav content-nav-root">
				<ContentNavButton path={PartPath} title="Home" icon="home" href="/"></ContentNavButton>
				<ContentNavButton path={NewPath} title="News feed" icon="news" href="/news">News</ContentNavButton>
				<ContentNavButton path={NewPath} title="Your feed" icon="feed" href="/feed">Feed</ContentNavButton>
				<ContentNavButton path={PartPath} title="Games" icon="gamepad" href="/games">Games</ContentNavButton>
				{ShowEvents}
			</div>
		);
//				<ContentNavButton path={PartPath} title="Community" icon='earth' href='/community'>Community</ContentNavButton>
	}
}

//					<ContentNavButton path={NewPath} title="Articles" icon='article' href='/articles'>Articles</ContentNavButton>
//					<ContentNavButton path={NewPath} title="Television" icon='tv' href='/tv'>TV</ContentNavButton>
//					<ContentNavButton path={NewPath} title="Everything" icon='infinity' href='/feed' minimize>Everything</ContentNavButton>

//					<ContentNavButton path={NewPath} title="About" icon='about' href='/about' class="-right">About</ContentNavButton>
