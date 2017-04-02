import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentUsers						from 'com/content-users/users';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentGames						from 'com/content-games/games';
import ContentEvent						from 'com/content-event/event';
//import ContentEvents					from 'com/content-events/events';
import ContentGroup						from 'com/content-group/group';
import Content404						from 'com/content-404/404';
import ContentItem						from 'com/content-item/item';

import ContentComments					from 'com/content-comments/comments';

import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentNavUser					from 'com/content-nav/nav-user';
//import ContentNavEvent					from 'com/content-nav/nav-event';

import ContentPalette					from 'com/content-palette/palette';

export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
	}
	
	getContent( {node, user, path, extra} ) {
		if ( node.name ) {
			document.title = titleParser.parse(node.name, true);
			if ( document.title === "" )
				document.title = window.location.host;
			else
				document.title += " | " + window.location.host;
		}
		else {
			document.title = window.location.host;
		}

		if ( node.type === 'post' ) {
			return (
				<div id="content">
					<ContentPost node={node} user={user} path={path} extra={extra} no_comments />
					<ContentComments node={node} user={user} path={path} extra={extra} />
				</div>
			);
		}
		else if ( node.type === 'item' ) {
			return (
				<div id="content">
					<ContentItem node={node} user={user} path={path} extra={extra} />
					<ContentComments node={node} user={user} path={path} extra={extra} />
				</div>
			);
		}
		else if ( node.type === 'user' ) {
			let View = null;
			let ViewType = null;
			if ( extra.length ) {
				ViewType = extra[0];
			}
			else {
				// TODO: check counts
				ViewType = 'games';
			}
				
			if ( ViewType ) {
				if ( ViewType === 'games' ) {
					View = <ContentGames types={['game']} methods={['author']} node={node} user={user} path={path} extra={extra} />;
				}
				else if ( ViewType === 'feed' ) {
					View = <ContentTimeline types={['post']} methods={['author']} node={node} user={user} path={path} extra={extra} />;
				}
			}

			return (
				<div id="content">
					<ContentUser node={node} user={user} path={path} extra={extra} />
					<ContentNavUser node={node} user={user} path={path} extra={extra} />
					{View}
				</div>
			);
		}
		else if ( node.type === 'users' ) {
			return (
				<div id="content">
					<ContentUsers node={node} user={user} path={path} extra={extra} />
				</div>
			);
		}
		else if ( node.type === 'event' ) {
			return (
				<div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} />
				</div>
			);
//					<ContentNavEvent node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'events' || node.type === 'group' ) {
			return <div id="content"><ContentGroup node={node} user={user} path={path} extra={extra} /></div>;
		}
		else if ( node.type === 'root' ) {
			var ShowNavRoot = <ContentNavRoot node={node} user={user} path={path} extra={extra} />;

			// If some extra arguments were passed, do virtual children			
			if ( extra.length ) {
				if ( extra[0] === 'news' ) {
					return <ContentTimeline types={['post']} subtypes={['news']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'hot' ) {
					return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'games' ) {
					return <ContentGames types={['game']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentGames>;
				}
				else if ( extra[0] === 'feed' ) {
					return <ContentTimeline types='' node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'palette' ) {
					return <div id="content"><ContentPalette node={node} user={user} path={path} extra={extra} /></div>;
				}
				else {
					return <div id="content"><Content404 user={user} path={path} extra={extra}>{extra[0]} not found</Content404></div>;
				}
			}
			// If logged in, default to the user timeline
			else if ( user && user.id ) {
				return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
			// If not logged in, default to news
			else {
				return <ContentTimeline types={['post']} subtypes={['news']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
		}
		else {
			return <div id="content"><div class='content-base'>Unsupported Node Type: {""+node.type}</div></div>;
		}
	}

	render( props ) {
		if ( props.node ) {
			return this.getContent(props);
		}
		else {
			return <div id="content">{this.props.children}</div>;
		}
	}
};
