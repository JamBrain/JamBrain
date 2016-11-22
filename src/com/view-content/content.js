import { h, Component }					from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {};
	}
	
	componentDidMount() {
	}
	
	getContent( {node, path}, state ) {
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
			return <ContentPost node={node} path={path+'/..'} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} path={path+'/..'} />;
		}
		else if ( node.type === 'root' || node.type === 'events' ) {
			return <ContentTimeline node={node} path={path} />;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( props, state ) {
		return (
			<div id="content">
				{ this.getContent( props, state ) }
			</div>
		);
	}
};
