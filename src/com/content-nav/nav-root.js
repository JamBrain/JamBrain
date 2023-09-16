import './nav.less';
import ContentNavButton	from './nav-button';

export default function ContentNavRoot( props ) {
	let {node, user, path, extra, ...otherProps} = props;

	var NewPath = '/'+ (extra ? extra.join('/') : '');
	var PartPath = '/'+ (extra && extra.length ? extra[0] : '');

	if ( NewPath == '/' )
		NewPath = '/home';

	return (
		<nav class="content -nav -root">
			<ContentNavButton path={PartPath} title="Home" icon="home" href="/"></ContentNavButton>
			<ContentNavButton path={NewPath} title="News feed" icon="news" href="/news">News</ContentNavButton>
			<ContentNavButton path={NewPath} title="Your feed" icon="feed" href="/feed">Feed</ContentNavButton>
			<ContentNavButton path={PartPath} title="Games" icon="gamepad" href="/games">Games</ContentNavButton>
			{/*<ContentNavButton path={PartPath} title="Community" icon='earth' href='/community'>Community</ContentNavButton>*/}
			{/*<ContentNavButton path={NewPath} title="Articles" icon='article' href='/articles'>Articles</ContentNavButton>*/}
			{/*<ContentNavButton path={NewPath} title="Television" icon='tv' href='/tv'>TV</ContentNavButton>*/}
			{/*<ContentNavButton path={NewPath} title="Everything" icon='infinity' href='/feed' minimize>Everything</ContentNavButton>*/}
			{/*<ContentNavButton path={NewPath} title="About" icon='about' href='/about' class="-right">About</ContentNavButton>*/}
			<ContentNavButton path={PartPath} title="Winners" icon="trophy" href="/events/ludum-dare">Events</ContentNavButton>
		</nav>
	);
}
