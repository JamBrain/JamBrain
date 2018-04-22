import {h, Component}					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavContent extends Component {
	render( props ) {
		let {node, parent, superparent, author, user, path, extra} = props;

		// Build paths
		let FullPath = ((extra && extra.length) ? ('/' + extra.join('/')) : '');
		FullPath = FullPath ? FullPath : '/';
		let FirstPath = FullPath.split('/', 2).join('/');

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		NavButtons.push(<ContentNavButton path={path+FullPath} icon="previous" href="/" />);

		let IsHome = (FullPath == '/');
		let IsLoggedIn = user && (user.id !== 0);

		NavButtons.push(<ContentNavButton path={path+FullPath} light={true} icon="trophy" href={path+'/'}>Event</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FullPath} light={FirstPath == '/my'} icon="user" href={path+'/my'}>Me</ContentNavButton>);

		// "Me" User Button (if home or logged in)
		if ( ['/my'].includes(FirstPath) ) {
			if ( user && (user.id !== 0) ) {
				NavButtons.push(<ContentNavButton path={path+FullPath} icon="star-half" href={path+'/my/grades'}>My Grades</ContentNavButton>);
			}
		}
		else {
			NavButtons.push(<ContentNavButton path={path+FirstPath} icon="ticket" href={path+'/theme'}>Theme</ContentNavButton>);
			NavButtons.push(<ContentNavButton path={path+FullPath} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>);
		}

		return (
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
