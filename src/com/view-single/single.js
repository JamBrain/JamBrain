import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';

import ViewSidebar						from 'com/view-sidebar/sidebar';

import CoreData							from '../../core-data/data';

export default class ViewSingle extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {};
		//this.state.feed = [];
	}
	
	componentDidMount() {
		
	}
	
	getNodes( props, state ) {
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
	
	render( props, state ) {
		// content-sidebar should be #body
		return (
			<div class="view-single">
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{ this.getNodes(props,state) }</div>
					<ViewSidebar />
				</div>
				<div id="footer">Single</div>
			</div>
		);
	}
};
