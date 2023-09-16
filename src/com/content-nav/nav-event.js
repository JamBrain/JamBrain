import './nav.less';
import ContentNavButton from './nav-button';

export default function ContentNavEvent( props ) {
	let {node, user, path, extra, ...otherProps} = props;

	let NewPath = '/'+ (extra ? extra.join('/') : '');
	let PartPath = '/'+ (extra && extra.length ? extra[0] : '');

	if ( NewPath === '/' ) {
		NewPath = '/home';
	}
	// Prefix with path
	NewPath = path + NewPath;
	PartPath = path + PartPath;

//	let ShowMyFeed = null;
//	if ( user && user.id ) {
//		ShowMyFeed = <ContentNavButton path={NewPath} title="Your Feed" icon='feed' href={path}>Feed</ContentNavButton>;
//	}
//	// Default to /hot if not logged in
//	else if ( NewPath === '/' ) {
//		NewPath = '/hot';
//	}

	return <nav class="content -nav -event">
		<ContentNavButton path={PartPath} title="Go back" icon="previous" href="/" />
		<ContentNavButton path={NewPath} title="Event" icon="trophy" href={path}>Event</ContentNavButton>
		{/*ShowMyFeed*/}
		{/*<ContentNavButton path={NewPath} title="Popular" icon='heart' href={path+'/hot'}>Popular</ContentNavButton>*/}
		{/*<ContentNavButton path={NewPath} title="News feed" icon='news' href={path+'/news'}>News</ContentNavButton>*/}
		{/*<ContentNavButton path={NewPath} title="Join Event" icon="gamepad" href={path+'/join'}>Join Event</ContentNavButton>*/}
		{(user && user.id) ? <ContentNavButton path={PartPath} title="Your Games" icon="user" href={path+'/my'}>Me</ContentNavButton> : null}
		{(node) ? <ContentNavButton path={PartPath} title="Theme" icon="ticket" href={path+'/theme'}>Theme</ContentNavButton> : null}
		{(node) ? <ContentNavButton path={PartPath} title="Theme" icon="ticket" href={path+'/theme'}>Theme</ContentNavButton> : null}
		<ContentNavButton path={NewPath} title="Statistics" icon="stats" href={path+'/stats'}>Stats</ContentNavButton>
	</nav>;
}
