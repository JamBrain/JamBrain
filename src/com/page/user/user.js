import {h, Component}					from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentUser						from 'com/content-user/user';
import ContentNavUser					from 'com/content-nav/nav-user';
import ContentError						from 'com/content-error/error';

import UserFeed							from './feed/feed';
import UserArticles						from './articles/articles';
import UserGames						from './games/games';
import UserFollowing					from './following/following';
import UserFollowers					from './followers/followers';
import UserStats						from './stats/stats';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

export default class PageUser extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

//		let userDefault = 'feed';
//		if ( node['games'] > 0 )
//			userDefault = 'games';
//		else if ( node['articles'] > 0 )
//			userDefault = 'articles';

		let editing = extra[extra.length - 1] == "edit";

		let ShowNav = null;
		if ( !editing ) {
			ShowNav = <ContentNavUser node={node} user={user} path={path} extra={extra} />;
		}

		return (
			<ContentList class="page-user">
				{ShowNav}
				<ContentUser node={node} user={user} path={path} extra={extra}/>
				<Router node={node} props={props}>
					<Route default={true} static path="/home" />
					<Route static path="/games" component={UserGames} />
					<Route static path="/articles" component={UserArticles} />
					<Route static path="/feed" component={UserFeed} />
					<Route static path="/following" component={UserFollowing} />
					<Route static path="/followers" component={UserFollowers} />
					<Route static path="/stats" component={UserStats} />
					<Route static path="/edit" />
					<Route type="error" component={ContentError} />
				</Router>
			</ContentList>
		);
	}
}

//					<Route default={userDefault == 'games'} static path="/games" component={UserGames} />
//					<Route default={userDefault == 'articles'} static path="/articles" component={UserArticles} />
//					<Route default={userDefault == 'feed'} static path="/feed" component={UserFeed} />
