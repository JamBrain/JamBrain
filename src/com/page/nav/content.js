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

		NavButtons.push(<ContentNavButton path={path+FullPath} light={true} icon="trophy" href={EventPath}>{EventName}</ContentNavButton>);

		return (
			<div class="content-base content-nav">
				{NavButtons}
			</div>
		);
	}
}
