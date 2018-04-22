import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
import ContentError						from 'com/content-error/error';

import PageNavRoot						from '../nav/root';

import PageRootHome						from './home/home';
import PageRootMy						from './my/my';
import PageRootFeed						from './feed/feed';
import PageRootFeedNews					from './feed/news';
import PageRootExplore					from './explore/explore';
import PageRootGames					from './games/games';
import PageRootTools					from './tools/tools';
import PageRootCommunities				from './communities/communities';
import PageRootSearch					from './search/search';

export default class PageRoot extends Component {
	render( props ) {
		// IMPORTANT NOTE: the ARGs for Router are bad. Please fix so {...props} works

		let Dummy = <div />;

		return (
			<ContentList class="page-root">
				<PageNavRoot {...props} />
				<Router node={props.node} props={props}>
					<Route static path="/home" default={true} component={PageRootHome} />
					<Route static path="/my" component={PageRootMy} />
					<Route static path="/my/settings" component={Dummy} />
					<Route static path="/news" component={PageRootFeedNews} />
					<Route static path="/feed" component={PageRootFeed} />
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
