import {h, Component}					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavUser extends Component {
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

		//let IsHome = (FullPath == '/');
		//let IsLoggedIn = user && (user.id !== 0);
		let IsNodeMe = user && (user.id == node.id);
		//let IsMe = ['/my'].includes(FirstPath);
		//let EventMode = (node.meta['event-mode']) ? parseInt(node.meta['event-mode']) : 0;

		// Back Button
		NavButtons.push(<ContentNavButton path={path+FullPath} title="Go Back" icon="previous" href="/" />);

		// Username button
		NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name} light={true} icon="user" href={path+'/'}>{node.name}</ContentNavButton>);

		// TODO: Remove `true` when endpoint actually returns number of games user participated on!
		if ( true || node['games'] > 0 ) {
			NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name + "'s Games"} icon="gamepad" href={path+'/games'}>Games</ContentNavButton>);
		}

		//if ( node['articles'] > 0 ) {
		//	NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name + "'s Articles"} icon="article" href={path+'/articles'}>Articles</ContentNavButton>);
		//}

		NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name + "'s Feed"} icon="feed" href={path+'/feed'}>Feed</ContentNavButton>);
		//NavButtons.push(<ContentNavButton path={path+FullPath} title={node.name + "'s Statistics"} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>);

		if ( IsNodeMe /*&& user.private && user.private["meta"] && user.private.meta["star"]*/ ) {
			NavButtons.push(<ContentNavButton path={path+FullPath} title={"Followed by " + user.name} icon="user-check" href={path+'/following'}>Following</ContentNavButton>);
		}

//		if ( IsNodeMe && user["private"] && user.private["refs"] && user.private.refs["star"]  ) {
//			Buttons.push(<ContentNavButton path={NewPath} title={user.name + "'s Followers"} icon='users' href={path+'/followers'}>Followers</ContentNavButton>);
//		}

		return (
			<div class="content content-nav">
				{NavButtons}
			</div>
		);
	}
}
