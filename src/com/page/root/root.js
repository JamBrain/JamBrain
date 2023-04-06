import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
import ContentEvent						from "com/content-event/event";
import ContentHeadlinerEvent			from 'com/content-headliner/headliner-event';
import ContentError						from 'com/content-error/error';


import PageNavRoot						from '../nav/root';

import PageRootHome						from './home/home';
import PageRootFeed						from './feed/feed';
import PageRootFeedRaw					from './feed/raw';
import PageRootFeedNews					from './feed/news';
import PageRootExplore					from './explore/explore';
import PageRootGames					from './games/games';
import PageRootTools					from './tools/tools';
import PageRootCommunities				from './communities/communities';
import PageRootSearch					from './search/search';

import PageMyHome 						from 'com/page/root/my/home';
import PageMySettings 					from 'com/page/root/my/settings';
import PageMyStats	 					from 'com/page/root/my/stats';
import PageMyNotifications 				from 'com/page/root/my/notifications';
import PageDevPalette 					from 'com/page/dev/palette';

import HeaderNoob						from 'com/header/noob/noob';

export default class PageRoot extends Component {
	render( props ) {
		const {node, user, path, extra, featured} = props;
		let Dummy = <div />;

		let ShowIntro = null;
		if (!user || !user.id) {
			ShowIntro = <HeaderNoob featured={featured} />;
		}

		let ActiveEvent = null;
		if ( featured && featured.id ) {
			// If logged in and you have a game in the current event (focus_id)
			if ( user && user.id && featured.focus_id ) {
				ActiveEvent = <ContentHeadlinerEvent node={featured} name="event" icon="trophy" flagclass="-col-ab" childclass="-col-a -inv-lit" style="--headlinerSize: 2.5rem;" />;
			}
			// Give more information about the event
			else {
				ActiveEvent = <ContentEvent node={featured} user={user} path={path} extra={extra} featured={featured} />;
			}
		}

		return (
			<ContentList class="page-root">
				{ShowIntro}
				{ActiveEvent}
				<PageNavRoot {...props} />
				<Router node={props.node} props={props} name="root">
					<Route static path="/" default={true} component={PageRootHome} />
					<Route static path="/my" component={PageMyHome}>
						<Route static path="/notifications" component={PageMyNotifications} />
						<Route static path="/stats" component={PageMyStats} />
						<Route static path="/settings" component={PageMySettings} />
					</Route>
					<Route static path="/dev">
						<Route static path="/palette" component={PageDevPalette} />
					</Route>
					<Route static path="/news" component={PageRootFeedNews} />
					<Route static path="/feed" component={PageRootFeed} />
					<Route static path="/feed/raw" component={PageRootFeedRaw} />
					<Route static path="/feed/news" component={PageRootFeedNews} />
					<Route static path="/feed/hot" component={Dummy} />
					<Route static path="/games/:filter?/:subfilter?/:target?" component={PageRootGames} />
					<Route static path="/explore" component={PageRootExplore} />
					<Route static path="/tools" component={PageRootTools} />
					<Route static path="/communities" component={PageRootCommunities} />
					<Route static path="/search" component={PageRootSearch} />
					<Route type="error" component={ContentError} />
				</Router>
			</ContentList>
		);
	}
}
