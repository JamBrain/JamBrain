import { h, Component }					from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentEvent						from 'com/content-event/event';

export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {};
	}
	
	getContent( {node, user, path, extra}, state ) {
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

		if ( node.type === 'post' || node.type === 'game' ) {
			return <ContentPost node={node} user={user} path={path+'../'} extra={extra} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} user={user} path={path+'../'} extra={extra} />;
		}
		else if ( node.type === 'event' ) {
			return <ContentEvent node={node} user={user} path={path+'../'} extra={extra} />;
		}
		else if ( node.type === 'root' || node.type === 'events' ) {
			return <ContentTimeline node={node} user={user} path={path} extra={extra} />;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( props, state ) {
		if ( props.node ) {
			return (
				<div id="content">
					{this.getContent(props, state)}
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
