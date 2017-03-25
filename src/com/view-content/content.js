import { h, Component }					from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentUsers						from 'com/content-users/users';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentEvent						from 'com/content-event/event';
//import ContentEvents					from 'com/content-events/events';
import ContentGroup						from 'com/content-group/group';
import Content404						from 'com/content-404/404';
import ContentItem						from 'com/content-item/item';

import ContentNavRoot					from 'com/content-nav/nav-root';

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
			return <ContentPost node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'item' ) {
			return <ContentItem node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'users' ) {
			return <ContentUsers node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'event' ) {
			return <ContentEvent node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'events' || node.type === 'group' ) {
			return <ContentGroup node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'root' ) {
			var ret = [];
			ret.push( <ContentNavRoot user={user} path={path} extra={extra} /> );
			
			if ( extra.length ) {
				if ( extra[0] === 'palette' ) {
					ret.push( <ContentPalette node={node} user={user} path={path} extra={extra} /> );
				}
				else {
					ret.push( <Content404 user={user} path={path} extra={extra}>{extra[0]} not found</Content404> );
				}
			}
			else {
				ret.push( <ContentTimeline node={node} user={user} path={path} extra={extra} /> );
			}
			
			return ret;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( props ) {
		if ( props.node ) {
			return (
				<div id="content">
					{this.getContent(props)}
				</div>
			);
		}
		else {
			return (
				<div id="content">
					{this.props.children}
				</div>
			);
		}
	}
};
