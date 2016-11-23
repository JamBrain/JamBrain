import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';

import ViewSidebar						from 'com/view-sidebar/sidebar';

import CoreData							from '../../core-data/data';

export default class ViewTimeline extends Component {
	constructor() {
		this.state = {};
		this.state.node = 1;
		this.state.feed = [10,11,12,13];
	}
	
	getNodes( props ) {
		CoreData.preFetchNodeWithAuthorById( this.state.feed );

		document.title = titleParser.parse(CoreData.getNodeNameById(this.state.node), true);
		if ( document.title === "" )
			document.title = window.location.host;
		else
			document.title += " | " + window.location.host;

		
		return this.state.feed.map(function(node) {
			var node_type = CoreData.getNodeTypeById(node);
			
			if ( node_type === 'post' ) {
				return <ContentPost node={node} />;
			}
			else {
				return <div>null</div>;
			}
		});
	}
	
	render( props ) {
		// content-sidebar should be #body
		return (
			<div class="view-timeline">
				<div id="header" />
				<div id="content-sidebar">
					<div id="content">{ this.getNodes(props) }</div>
					<ViewSidebar />
				</div>
				<div id="footer">Timeline</div>
			</div>
		);
	}
};
