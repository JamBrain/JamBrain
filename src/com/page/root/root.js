import {h, Component, Fragment}			from 'preact';

import {ContentRouter, Route} from "com/router";

import ContentEvent						from "com/content-event/event";
import ContentHeadlinerEvent			from 'com/content-headliner/headliner-event';

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
			<Fragment>
				{ShowIntro}
				{ActiveEvent}
				<PageNavRoot {...props} />
				<ContentRouter props={props} key="root">
					<Route path="/" component={PageRootHome} />
					<Route path="/my" component={PageMyHome}>
						<Route path="/notifications" component={PageMyNotifications} />
						<Route path="/stats" component={PageMyStats} />
						<Route path="/settings" component={PageMySettings} />
					</Route>
					<Route path="/dev">
						<Route path="/palette" component={PageDevPalette} />
					</Route>
					<Route path="/news" component={PageRootFeedNews} />
					<Route path="/feed" component={PageRootFeed}>
						<Route path="/raw" component={PageRootFeedRaw} />
						<Route path="/news" component={PageRootFeedNews} />
						<Route path="/hot" />
					</Route>
					<Route path="/games/:filter?/:subfilter?/:target?/*" component={PageRootGames} />
					<Route path="/explore/*" component={PageRootExplore} />
					<Route path="/tools/*" component={PageRootTools} />
					<Route path="/communities/*" component={PageRootCommunities} />
					<Route path="/search/*" component={PageRootSearch} />
					<Route type="error" component={ContentError} />
				</ContentRouter>
			</Fragment>
		);
	}
}
