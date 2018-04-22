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

		let EventName = "Event";
		let EventPath = path+'/';
		if ( node && (node.type == 'event') ) {
			EventName = node.name;
			EventPath = node.path;
		}
		else if ( parent && (parent.type == 'event') ) {
			EventName = parent.name;
			EventPath = parent.path;
		}
		else if ( superparent && (superparent.type == 'event') ) {
			EventName = superparent.name;
			EventPath = superparent.path;
		}

		let GameName = "Game";
		let GamePath = path+'/';
		if ( node && (node.type == 'item') ) {
			GameName = node.name ? node.name : "Untitled";
			GamePath = node.path;
		}
		else if ( parent && (parent.type == 'item') ) {
			GameName = parent.name ? parent.name : "Untitled";
			GamePath = parent.path;
		}

		console.log(path, FullPath, GamePath);

		NavButtons.push(<ContentNavButton path={path+FullPath} light={true} icon="trophy" href={EventPath}>{EventName}</ContentNavButton>);
		NavButtons.push(<ContentNavButton path={path+FullPath} light={true} icon="gamepad" href={EventPath+"/games"}>Games</ContentNavButton>);

		NavButtons.push(<ContentNavButton path={path+((FullPath == '/') ? '' : FullPath)} icon="gamepad" href={GamePath}>{GameName}</ContentNavButton>);

		return (
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
