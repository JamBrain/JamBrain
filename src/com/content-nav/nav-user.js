import {h, Component} 					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavUser extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

		if ( !node || !user )
			return null;

        let NewPath = '/'+ (extra ? extra.join('/') : '');
		let PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		let ShowMyFeed = null;
		if ( NewPath === '/' ) {
			NewPath = '/home';
		}
		// Prefix with path
		NewPath = path + NewPath;
		PartPath = path + PartPath;

		var ShowGames = null;
		console.log(node);
		// TODO: Remove `true` when endpoint actually returns number of games user participated on!
		if ( true || node['games'] > 0 ) {
			ShowGames = <ContentNavButton path={NewPath} title={node.name + "'s Games"} icon="gamepad" href={path+'/games'}>Games</ContentNavButton>;
		}

		var ShowArticles = null;
		if ( node['articles'] > 0 ) {
			ShowArticles = <ContentNavButton path={NewPath} title={node.name + "'s Articles"} icon="article" href={path+'/articles'}>Articles</ContentNavButton>;
		}

		var ShowFeed = <ContentNavButton path={NewPath} title={node.name + "'s Feed"} icon="feed" href={path+'/feed'}>Feed</ContentNavButton>;

		var ShowFollowing = null;
		if ( user && (user.id == node.id) && user.private /*&& user.private["meta"] && user.private.meta["star"]*/ ) {
			ShowFollowing = <ContentNavButton path={NewPath} title={"Followed by " + user.name} icon="user-check" href={path+'/following'}>Following</ContentNavButton>;
		}

		var ShowFollowers = null;
//		if ( user && (user.id == node.id) && user["private"] && user.private["refs"] && user.private.refs["star"]  ) {
//			ShowFollowers = <ContentNavButton path={NewPath} title={user.name + "'s Followers"} icon='users' href={path+'/followers'}>Followers</ContentNavButton>;
//		}

		var ShowStats = <ContentNavButton path={NewPath} title={user.slug + "'s Statistics"} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>;

		return (
			<div class="content-base content-nav content-nav-user">
				<ContentNavButton path={PartPath} title="Go Back" icon="previous" href="/" />
				<ContentNavButton path={PartPath} title={user.slug} icon="user" href={path+'/'}>User</ContentNavButton>
                {ShowGames}
				{ShowArticles}
				{ShowFeed}
				{ShowStats}
				{ShowFollowing}
				{ShowFollowers}
			</div>
		);
	}
}
