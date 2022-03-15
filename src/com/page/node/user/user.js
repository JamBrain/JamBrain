import {h, Component, Fragment} from 'preact';
import PageNavUser						from 'com/page/nav/user';

import ContentUser						from 'com/content-user/user';
import ContentHeadliner					from 'com/content-headliner/headliner';

import UserFeed							from './feed/feed';
import UserArticles						from './articles/articles';
import UserGames						from './games/games';
import UserFollowing					from './following/following';
import UserFollowers					from './followers/followers';
import UserStats						from './stats/stats';

import {ContentRouter, Route} from "com/router";


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
			<Fragment>
				{!isEditing ? Header : null}
				{!isEditing ? <PageNavUser {...props} /> : null}
				<ContentRouter props={props} key="user">
					<Route path="/" component={ContentUser} />
					<Route path="/games/*" component={UserGames} />
					<Route path="/articles/*" component={UserArticles} />
					<Route path="/feed" component={UserFeed} />
					<Route path="/following" component={UserFollowing} />
					<Route path="/followers" component={UserFollowers} />
					<Route path="/stats/*" component={UserStats} />
				</ContentRouter>
			</Fragment>
		);
	}
}
