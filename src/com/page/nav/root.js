import {h, Component}					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavRoot extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		// Build paths
		let FullPath = path + ((extra && extra.length) ? ('/' + extra.join('/')) : '');
		FullPath = FullPath ? FullPath : '/';
		let FirstPath = FullPath.split('/', 2).join('/');

		// Transform paths
		const FullPathRemaps = {
			'/news': '/feed/news'
		};
		if ( FullPathRemaps[FullPath] )
			FullPath = FullPathRemaps[FullPath];

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		// Home/Back button
		let IsHome = (FullPath == '/');
		if ( IsHome )
			NavButtons.push(<ContentNavButton path={FullPath} icon="home" href="/" />);
		else
			NavButtons.push(<ContentNavButton path={FullPath} icon="previous" href="/" />);

		// "Me" User Button (if home or logged in)
		if ( ['/', '/my'].includes(FirstPath) && user && (user.id !== 0) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="user" href="/my">Me</ContentNavButton>);

			if ( !IsHome ) {
				NavButtons.push(<ContentNavButton path={FullPath} icon="bubble" href="/my/notifications">Notifications</ContentNavButton>);
				NavButtons.push(<ContentNavButton path={FullPath} icon="stats" href="/my/stats">Stats</ContentNavButton>);
				NavButtons.push(<ContentNavButton path={FullPath} icon="cog" href="/my/settings">Settings</ContentNavButton>);
			}
		}

		if ( ['/', '/feed', '/news'].includes(FirstPath) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="feed" href="/feed">Feed</ContentNavButton>);

//			if ( !IsHome )
//				NavButtons.push(<ContentNavButton path={FullPath} icon="fire" href="/feed/hot">Hot</ContentNavButton>);

			NavButtons.push(<ContentNavButton path={FullPath} icon="news" href="/feed/news">News</ContentNavButton>);
		}

		if ( ['/', '/explore', '/games', '/events', '/tools', '/communities'].includes(FirstPath) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="browse" href="/explore">Explore</ContentNavButton>);
			NavButtons.push(<ContentNavButton path={FirstPath} icon="gamepad" href="/games">Games</ContentNavButton>);

			if ( FirstPath != '/' ) {
				// if ldjam.com vs jammer.vg
				if ( true )
					NavButtons.push(<ContentNavButton path={FirstPath} icon="trophy" href="/events/ludum-dare" match="/events">Events</ContentNavButton>);
				else
					NavButtons.push(<ContentNavButton path={FirstPath} icon="trophy" href="/events">Events</ContentNavButton>);

				NavButtons.push(<ContentNavButton path={FullPath} icon="hammer" href="/tools">Tools</ContentNavButton>);
				NavButtons.push(<ContentNavButton path={FullPath} icon="users" href="/communities">Communities</ContentNavButton>);
			}
		}

		if ( ['/dev'].includes(FirstPath) || (location.search.indexOf('debug') >= 0) ) {
			NavButtons.push(<ContentNavButton path={FullPath} light={!IsHome} icon="embed" href="/dev">Dev</ContentNavButton>);

			if ( !IsHome ) {
				NavButtons.push(<ContentNavButton path={FullPath} icon="image" href="/dev/palette">Palette</ContentNavButton>);
			}
		}

		return (
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
