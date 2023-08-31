import {h, Component}					from 'preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavEvent extends Component {
	render( props ) {
		let {node, parent, superparent, author, user, path, extra} = props;

		if ( !node ) return null;
		if ( !path ) return null;

		// Build paths
		let FullPath = ((extra && extra.length) ? ('/' + extra.join('/')) : '');
		FullPath = FullPath ? FullPath : '/';
		let FirstPath = FullPath.split('/', 2).join('/');

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		NavButtons.push(<ContentNavButton path={path+FullPath} title="Go Back" icon="previous" href="/" />);

		let IsHome = (FullPath == '/');
		let IsLoggedIn = user && (user.id !== 0);
		let IsMe = ['/my'].includes(FirstPath);
		let EventMode = (node.meta['event-mode']) ? Number(node.meta['event-mode']) : 0;

		NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name} light={true} icon="trophy" href={path+'/'}>{node.name}</ContentNavButton>);

		if ( EventMode >= 8 ) {
			NavButtons.push(<ContentNavButton path={path+FirstPath} title="Results" icon="gamepad" href={path+'/results'}>Results</ContentNavButton>);
		}

		NavButtons.push(<ContentNavButton path={path+FirstPath} title="Games" icon="gamepad" href={path+'/games'}>Games</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FirstPath} title="Theme" icon="ticket" href={path+'/theme'}>Theme</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FullPath} title="Stats" icon="stats" href={path+'/stats'}>Stats</ContentNavButton>);

		if ( IsLoggedIn ) {
			/* light={FirstPath == '/my'} */
			NavButtons.push(<ContentNavButton path={path+FirstPath} title="Me" icon="user" href={path+'/my'}>Me</ContentNavButton>);
		}

//		// "Me" User Button (if home or logged in)
//		if ( IsMe ) {
//			if ( user && (user.id !== 0) ) {
//				NavButtons.push(<ContentNavButton path={path+FullPath} title="My Grades" icon="star-half" href={path+'/my/grades'}>My Grades</ContentNavButton>);
//			}
//		}

		return (
			<nav class="content -nav">
				{NavButtons}
			</nav>
		);
	}
}
