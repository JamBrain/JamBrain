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
	
/*	getNodes( props, state ) {
		var nodes = [props.node];
		
		console.log(nodes);
		
		//CoreData.preFetchNodeWithAuthorById( nodes );
		
		return nodes.map(function(node) {
//			document.title = titleParser.parse(node.name, true);
//			if ( document.title === "" )
//				document.title = window.location.host;
//			else
//				document.title += " | " + window.location.host;
		
			if ( node.type === 'post' || node.type === 'game' ) {
				return <ContentPost node={node} />;
			}
			if ( node.type === 'user' ) {
				return <ContentUser node={node} />;
			}
			else {
				return <div>null</div>;
			}
		});
	}
*/	
	getContent( {node}, state ) {
		console.log("gct");
		if ( node.type === 'post' ) {
			return <ContentPost node={node} />;
		}
		else {
			return <div>Unsupported Node Type: {""+node.type}</div>;
		}
	}

	render( props, state ) {
		// content-sidebar should be #body
		return (
			<div id="content">
				{ this.getContent( props, state ) }
			</div>
		);
	}
};
//				{ this.getNodes(props,state) }
