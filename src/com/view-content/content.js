import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {};
	}
	
	componentDidMount() {
		
	}
	
	getContent( {node}, state ) {
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
			return <ContentPost node={node} />;
		}
		else if ( node.type === 'user' ) {
			return <ContentUser node={node} />;
		}
//		else if ( node.type === 'root' ) {
//			return <ContentUser node={node} />;
//		}
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
