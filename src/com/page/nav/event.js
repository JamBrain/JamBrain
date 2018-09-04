import {h, Component}					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavEvent extends Component {
	render( props ) {
		let {node, parent, superparent, author, user, path, extra} = props;

		// Build paths
		let FullPath = ((extra && extra.length) ? ('/' + extra.join('/')) : '');
		FullPath = FullPath ? FullPath : '/';
		let FirstPath = FullPath.split('/', 2).join('/');

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		NavButtons.push(<ContentNavButton path={path+FullPath} icon="previous" href="/" title="Preious" />);

		let IsHome = (FullPath == '/');
		let IsLoggedIn = user && (user.id !== 0);
		let IsMe = ['/my'].includes(FirstPath);
		let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;

		NavButtons.push(<ContentNavButton path={path+FullPath} light={true} icon="trophy" href={path+'/'} title={node.name}>{node.name}</ContentNavButton>);

		if ( ThemeMode >= 8 ) {
			NavButtons.push(<ContentNavButton path={path+FirstPath} icon="gamepad" href={path+'/results'} title="Results">Results</ContentNavButton>);
		}

		NavButtons.push(<ContentNavButton path={path+FirstPath} icon="gamepad" href={path+'/games'} title="Games">Games</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FirstPath} icon="ticket" href={path+'/theme'} title="Theme">Theme</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FullPath} icon="stats" href={path+'/stats'} title="Stats">Stats</ContentNavButton>);

		if ( IsLoggedIn ) {
			/* light={FirstPath == '/my'} */
			NavButtons.push(<ContentNavButton path={path+FirstPath} icon="user" href={path+'/my'} title="Me">Me</ContentNavButton>);
		}

//		// "Me" User Button (if home or logged in)
//		if ( IsMe ) {
//			if ( user && (user.id !== 0) ) {
//				NavButtons.push(<ContentNavButton path={path+FullPath} icon="star-half" href={path+'/my/grades'}>My Grades</ContentNavButton>);
//			}
//		}

		return (
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
