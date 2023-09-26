import './nav.less';
import ContentNavButton	from './nav-button';

export default function ContentNavUser( props ) {
	let {node, user, path, extra, ...otherProps} = props;

	if ( !node || !user )
		return null;

	let NewPath = '/'+ (extra ? extra.join('/') : '');
	let PartPath = '/'+ (extra && extra.length ? extra[0] : '');

	if ( NewPath === '/' ) {
		NewPath = '/home';
	}
	// Prefix with path
	NewPath = path + NewPath;
	PartPath = path + PartPath;

	DEBUG && console.log("PATH", NewPath, PartPath);

	const isFollowing = user && (user.id == node.id) && user.private; /*&& user.private["meta"] && user.private.meta["star"]*/
//	const hasFollowers = user && (user.id == node.id) && user["private"] && user.private["refs"] && user.private.refs["star"];

	return (
		<nav class="content -nav -user">
			<ContentNavButton path={PartPath} title="Go Back" icon="previous" href="/" />,
			<ContentNavButton path={PartPath} title={user.slug} icon="user" href={path}>{user.name}</ContentNavButton>
			{/* TODO: Remove `true` when endpoint actually returns number of games user participated on! */}
			{(true && node['games'] > 0) ? <ContentNavButton path={NewPath} title={node.name + "'s Games"} icon="gamepad" href={path+'/games'}>Games</ContentNavButton> : null}
			{node['articles'] > 0 ? <ContentNavButton path={NewPath} title={node.name + "'s Articles"} icon="article" href={path+'/articles'}>Articles</ContentNavButton> : null}
			<ContentNavButton path={NewPath} title={node.name + "'s Feed"} icon="feed" href={path+'/feed'}>Feed</ContentNavButton>
			{isFollowing ? <ContentNavButton path={NewPath} title={"Followed by " + user.name} icon="user-check" href={path+'/following'}>Following</ContentNavButton> : null}
			{/*hasFollowers ? <ContentNavButton path={NewPath} title={user.name + "'s Followers"} icon='users' href={path+'/followers'}>Followers</ContentNavButton> : null*/}
			<ContentNavButton path={NewPath} title={user.slug + "'s Statistics"} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>
		</nav>
	);
}
