import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
import ContentError						from 'com/content-error/error';

import PageNavRoot						from '../nav/root';

import PageRootHome						from './home/home';
import PageRootFeed						from './feed/feed';
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

const STORAGE_HEADER_DISMISSED = 'isNoobHeaderDismissed';

export default class PageRoot extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isNoobHeaderDisplayed: (!props.user || !props.user.id) &&
				!localStorage.getItem(STORAGE_HEADER_DISMISSED),
		};
	}

	dismissNoobHeader() {
		localStorage.setItem(STORAGE_HEADER_DISMISSED, 'true');
		this.setState({
			isNoobHeaderDisplayed: false,
		});
	}

	render( props ) {
		const {node, user, path, extra, featured} = props;
		let Dummy = <div />;

		let ShowIntro = null;
		if (this.state.isNoobHeaderDisplayed) {
			ShowIntro = <HeaderNoob onDismiss={this.dismissNoobHeader.bind(this)} />;
		}

		return (
			<ContentList class="page-root">
				{ShowIntro}
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
