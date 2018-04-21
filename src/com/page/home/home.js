import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
import ContentError						from 'com/content-error/error';

import PageNavRoot						from '../nav/root';

import PageHomeHome						from './home/home';
import PageHomeMy						from './my/my';
import PageHomeFeed						from './feed/feed';
import PageHomeNews						from './news/news';
import PageHomeExplore					from './explore/explore';
import PageHomeGames					from './games/games';
import PageHomeTools					from './tools/tools';
import PageHomeCommunities				from './communities/communities';
import PageHomeSearch					from './search/search';

export default class PageHome extends Component {
	render( props ) {
		let {node, user, extra} = props;

		return (
			<ContentList class="page-home">
				<PageNavRoot {...props} />
				<Router node={node} props={props}>
					<Route static path="/home" default={true} component={PageHomeHome} />
					<Route static path="/my" component={PageHomeMy} />
					<Route static path="/my/settings" component={PageHomeMy} />
					<Route static path="/news" component={PageHomeNews} />
					<Route static path="/feed" component={PageHomeFeed} />
					<Route static path="/feed/news" component={PageHomeNews} />
					<Route static path="/feed/hot" component={PageHomeNews} />
					<Route static path="/games/:filter?/:subfilter?/:target?" component={PageHomeGames} />
					<Route static path="/explore" component={PageHomeExplore} />
					<Route static path="/tools" component={PageHomeTools} />
					<Route static path="/communities" component={PageHomeCommunities} />
					<Route static path="/search" component={PageHomeSearch} />
					<Route type="error" component={ContentError} />
				</Router>
			</ContentList>
		);
	}
}
