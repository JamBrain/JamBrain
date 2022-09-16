import {h, Component}	from 'preact/preact';
import ContentNavButton	from './nav-button';


export default class ContentNavUser extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		if ( !node || !user )
			return null;

        let NewPath = '/'+ (extra ? extra.join('/') : '');
		let PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		if ( NewPath === '/' ) {
			NewPath = '/home';
		}
		// Prefix with path
		NewPath = path + NewPath;
		PartPath = path + PartPath;

		console.log("PATH", NewPath, PartPath);

		let Buttons = [
			<ContentNavButton path={PartPath} title="Go Back" icon="previous" href="/" />,
			<ContentNavButton path={PartPath} title={user.slug} icon="user" href={path}>{user.name}</ContentNavButton>
		];

		// TODO: Remove `true` when endpoint actually returns number of games user participated on!
		if ( true || node['games'] > 0 ) {
			Buttons.push(<ContentNavButton path={NewPath} title={node.name + "'s Games"} icon="gamepad" href={path+'/games'}>Games</ContentNavButton>);
		}

		if ( node['articles'] > 0 ) {
			Buttons.push(<ContentNavButton path={NewPath} title={node.name + "'s Articles"} icon="article" href={path+'/articles'}>Articles</ContentNavButton>);
		}

		Buttons.push(<ContentNavButton path={NewPath} title={node.name + "'s Feed"} icon="feed" href={path+'/feed'}>Feed</ContentNavButton>);

		if ( user && (user.id == node.id) && user.private /*&& user.private["meta"] && user.private.meta["star"]*/ ) {
			Buttons.push(<ContentNavButton path={NewPath} title={"Followed by " + user.name} icon="user-check" href={path+'/following'}>Following</ContentNavButton>);
		}

//		if ( user && (user.id == node.id) && user["private"] && user.private["refs"] && user.private.refs["star"]  ) {
//			Buttons.push(<ContentNavButton path={NewPath} title={user.name + "'s Followers"} icon='users' href={path+'/followers'}>Followers</ContentNavButton>);
//		}

		Buttons.push(<ContentNavButton path={NewPath} title={user.slug + "'s Statistics"} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>);

		return (
			<nav class="content -nav -user">
                {Buttons}
			</nav>
		);
	}
}
