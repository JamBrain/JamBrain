import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentError						from 'com/content-error/error';

import PageHomeFeed						from './feed/feed';
import PageHomeHome						from './home/home';
import PageHomeNews						from './news/news';
import PageHomeGames					from './games/games';

export default class PageHome extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;
		//let loggedIn = user && (user.id !== 0);

		return (
			<ContentList class="page-home">
				<ContentNavRoot node={node} user={user} path={path} extra={extra} />
				<Router node={node} props={props}>
					<Route default={true} static path="/home" component={PageHomeHome} />
					<Route static path="/feed" component={PageHomeFeed} />
					<Route static path="/news" component={PageHomeNews} />
					<Route static path="/games/:filter?/:subfilter?/:target?" component={PageHomeGames} />
					{/* <Route static path="/hot" component={PageHomeHot} /> */}

					<Route type="error" component={ContentError} />
				</Router>
			</ContentList>
		);
	}

//					<Route default={loggedIn} static path="/home" component={PageHomeHome} />
//					<Route default={!loggedIn} static path="/feed" component={PageHomeFeed} />
}
