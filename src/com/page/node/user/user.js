import {h, Component, Fragment}			from 'preact';
import PageNavUser						from 'com/page/nav/user';

//import ContentList						from 'com/content-list/list';
import ContentUser						from 'com/content-user/user';
import ContentError						from 'com/content-error/error';
import ContentHeadliner					from 'com/content-headliner/headliner';

import UserFeed							from './feed/feed';
import UserArticles						from './articles/articles';
import UserGames						from './games/games';
import UserFollowing					from './following/following';
import UserFollowers					from './followers/followers';
import UserStats						from './stats/stats';

import {Router, Route}					from "com/router/router";


export default class PageUser extends Component {
	render( props ) {
		let {node, user, extra} = props;
		let isMe = node && user && node.id && (node.id == user.id);
		let isEditing = extra[extra.length - 1] == "edit";

		let Header = <ContentHeadliner
			node={node}
			name="user"
			icon="user"
			flagclass={isMe ? "-col-bc -inv" : "-col-bc"}
			childclass={isMe ? "-col-bc" : "-inv -inv-lit"}
		/>;

		return (
			<Fragment class="page-user">
				{!isEditing ? Header : null}
				{!isEditing ? <PageNavUser {...props} /> : null}
				<Router props={props} key="user">
					<Route path="/" component={ContentUser} />
					<Route path="/games/*" component={UserGames} />
					<Route path="/articles" component={UserArticles} />
					<Route path="/feed" component={UserFeed} />
					<Route path="/following" component={UserFollowing} />
					<Route path="/followers" component={UserFollowers} />
					<Route path="/stats" component={UserStats} />
					<Route error component={ContentError} />
				</Router>
			</Fragment>
		);
	}
}
