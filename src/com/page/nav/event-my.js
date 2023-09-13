import { Component } from 'preact';
import ContentNavButton					from 'com/content-nav/nav-button';

export default class PageNavEventMy extends Component {
	render( props ) {
		let {node, parent, superparent, author, user, path, extra} = props;

		//if ( !node ) return null;

		// Build paths
		let FullPath = ((extra && extra.length) ? ('/' + extra.join('/')) : '');
		FullPath = FullPath ? FullPath : '/';
		let FirstPath = FullPath.split('/', 2).join('/');

		// Begin populating the list of Nav Buttons
		let NavButtons = [];

		NavButtons.push(<ContentNavButton path={path+FullPath} title="Home" icon="home" href={path+"/my"}>Home</ContentNavButton>);

//		let IsHome = (FullPath == '/');
		let IsLoggedIn = user && (user.id !== 0);
//		let IsMe = ['/my'].includes(FirstPath);

		if ( IsLoggedIn ) {
			NavButtons.push(<ContentNavButton path={path+FullPath} title="My Grades" icon="star-half" href={path+'/my/grades'}>My Grades</ContentNavButton>);
		}

		return (
			<nav class="content -nav">
				{NavButtons}
			</nav>
		);
	}
}
