import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavUser extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}


	render( {node, user, path, extra}, {} ) {

        var NewPath = '/'+ (extra ? extra.join('/') : '');

		var ShowMyFeed = null;
		if ( NewPath === '/' ) {
			// Default to games, articles, or feed if no games/articles are available
            // Disabled games as default because its doesn't work great.
			/*if ( node['games'] > 0 )
				NewPath = '/games';
			else*/ if ( node['articles'] > 0 )
				NewPath = '/articles';
			else
				NewPath = '/feed';
		}
		// Prefix with path
		NewPath = path + NewPath;

		var HasFeed = <ContentNavButton path={NewPath} icon='feed' href={path+'/feed'}>Feed</ContentNavButton>;

		var HasFollowing = null;
		if ( user.id == node.id && user && user.private /*&& user.private["link"] && user.private.link["star"]*/ ) {
			HasFollowing = <ContentNavButton path={NewPath} icon='user-check' href={path+'/following'}>Following</ContentNavButton>;
		}

		var HasFollowers = null;
//		if ( user.id == node.id && user["private"] && user.private["refs"] && user.private.refs["star"]  ) {
//			HasFollowers = <ContentNavButton path={NewPath} icon='users' href={path+'/followers'}>Followers</ContentNavButton>;
//		}

        var HasGames = null;
		if ( node['games'] > 0 ) {
			HasGames = <ContentNavButton path={NewPath} icon='gamepad' href={path+'/games'}>Games</ContentNavButton>;
		}

		var HasArticles = null;
		if ( node['articles'] > 0 ) {
			HasArticles = <ContentNavButton path={NewPath} icon='article' href={path+'/articles'}>Articles</ContentNavButton>;
		}

		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					{HasArticles}
					{HasFeed}
                    {HasGames}
					{HasFollowing}
					{HasFollowers}
				</div>
			</div>
		);
	}
}
