import {h, Component}					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavRoot extends Component {
	render( props ) {
		let {node, user, extra} = props;

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
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
