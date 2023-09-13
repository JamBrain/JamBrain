import { Component } from 'preact';
import ContentHeadliner					from 'com/content-headliner/headliner';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class PageRootFeedRaw extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		return (
			<ContentList class="page-home-feed-raw">
				<ContentHeadliner title="Everything" name="feed" icon="feed" flagclass="-col-ab" childclass="" />
				<ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} raw />
			</ContentList>
		);
	}
}
