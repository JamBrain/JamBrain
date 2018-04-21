import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';

import ContentList						from 'com/content-list/list';
//import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentError						from 'com/content-error/error';

import ContentNavButton					from 'com/content-nav/nav-button';

import PageHomeHome						from './home/home';
import PageHomeMy						from './my/my';
import PageHomeFeed						from './feed/feed';
import PageHomeNews						from './news/news';
import PageHomeSearch					from './search/search';
import PageHomeGames					from './games/games';

export default class PageHome extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		//
		let FirstPath = '/'+ (extra && extra.length ? extra[0] : '');
		let FullPath = '/'+ (extra ? extra.join('/') : '');

		// Transform paths
		if ( FirstPath == '/' )
			FirstPath = '/home';
		const FullPathRemaps = {
			'/': '/home',
			'/news': '/feed/news'
		};
		if ( FullPathRemaps[FullPath] )
			FullPath = FullPathRemaps[FullPath];

		let IsHome = FullPath == '/home';


//		console.log(FirstPath, FullPath, FullPathRemaps, extra);

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		// Home/Back button
		if ( FullPath == '/home' )
			NavButtons.push(<ContentNavButton path={FullPath} icon="home" href="/" match="/home" />);
		else
			NavButtons.push(<ContentNavButton path={FullPath} icon="previous" href="/" match="/home" />);

//		// "Me" User Button (if home or logged in)
//		if ( (FullPath == '/home') && user && (user.id !== 0) ) {
//			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="user" href="/my">Me</ContentNavButton>);
//		}

		if ( ['/home', '/feed', '/news'].includes(FirstPath) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="feed" href="/feed">Feed</ContentNavButton>);

//			if ( FirstPath == '/feed' )
//				NavButtons.push(<ContentNavButton path={FullPath} icon="fire" href="/feed/hot">Hot</ContentNavButton>);

			NavButtons.push(<ContentNavButton path={FullPath} icon="news" href="/feed/news">News</ContentNavButton>);
		}

		if ( ['/home', '/explore', '/games', '/events', '/tools', '/communities'].includes(FirstPath) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="browse" href="/explore">Explore</ContentNavButton>);
			NavButtons.push(<ContentNavButton path={FirstPath} icon="gamepad" href="/games">Games</ContentNavButton>);

			if ( FirstPath != '/home' ) {
				// if ldjam.com vs jammer.vg
				if ( true )
					NavButtons.push(<ContentNavButton path={FirstPath} icon="trophy" href="/events/ludum-dare">Events</ContentNavButton>);
				else
					NavButtons.push(<ContentNavButton path={FirstPath} icon="trophy" href="/events">Events</ContentNavButton>);

				NavButtons.push(<ContentNavButton path={FullPath} icon="hammer" href="/tools">Tools</ContentNavButton>);
				NavButtons.push(<ContentNavButton path={FullPath} icon="users" href="/communities">Communities</ContentNavButton>);
			}
		}

		return (
			<ContentList class="page-home">
				<div class="content-base content-nav">
					{NavButtons}
				</div>
				<Router node={node} props={props}>
					<Route static path="/home" default={true} component={PageHomeHome} />
					<Route static path="/my" component={PageHomeMy} />
					<Route static path="/my/settings" component={PageHomeMy} />
					<Route static path="/news" component={PageHomeNews} />
					<Route static path="/feed" component={PageHomeFeed} />
					<Route static path="/feed/news" component={PageHomeNews} />
					<Route static path="/feed/hot" component={PageHomeNews} />
					<Route static path="/games/:filter?/:subfilter?/:target?" component={PageHomeGames} />
					<Route static path="/explore" component={PageHomeMy} />
					<Route static path="/search" component={PageHomeSearch} />
					<Route type="error" component={ContentError} />
				</Router>
			</ContentList>
		);
	}

//				<ContentNavRoot node={node} user={user} path={path} extra={extra} />
}
