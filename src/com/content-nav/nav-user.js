import {h, Component} 					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavUser extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

        var NewPath = '/'+ (extra ? extra.join('/') : '');
		var PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		var ShowMyFeed = null;
		if ( NewPath === '/' ) {
			NewPath = '/home';
//			// Default to games, articles, or feed if no games/articles are available
//			if ( node['games'] > 0 )
//				NewPath = '/games';
//			else if ( node['articles'] > 0 )
//				NewPath = '/articles';
//			else
//				NewPath = '/feed';
		}
		// Prefix with path
		NewPath = path + NewPath;
		PartPath = path + PartPath;

		var ShowGames = null;
		if ( node['games'] > 0 ) {
			ShowGames = <ContentNavButton path={NewPath} icon="gamepad" href={path+'/games'}>Games</ContentNavButton>;
		}

		var ShowArticles = null;
		if ( node['articles'] > 0 ) {
			ShowArticles = <ContentNavButton path={NewPath} icon="article" href={path+'/articles'}>Articles</ContentNavButton>;
		}

		var ShowFeed = <ContentNavButton path={NewPath} icon="feed" href={path+'/feed'}>Feed</ContentNavButton>;

		var ShowFollowing = null;
		if ( user.id == node.id && user && user.private /*&& user.private["meta"] && user.private.meta["star"]*/ ) {
			ShowFollowing = <ContentNavButton path={NewPath} icon="user-check" href={path+'/following'}>Following</ContentNavButton>;
		}

		var ShowFollowers = null;
//		if ( user.id == node.id && user["private"] && user.private["refs"] && user.private.refs["star"]  ) {
//			ShowFollowers = <ContentNavButton path={NewPath} icon='users' href={path+'/followers'}>Followers</ContentNavButton>;
//		}

		var ShowStats = <ContentNavButton path={NewPath} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>;

		return (
			<div class="content-base content-nav content-nav-user">
				<ContentNavButton path={PartPath} icon="previous" href="/" />
				<ContentNavButton path={PartPath} icon="user" href={path+'/'}>User</ContentNavButton>
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
