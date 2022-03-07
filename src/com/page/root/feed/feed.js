import {h, Component}					from 'preact/preact';
import ContentHeadliner					from 'com/content-headliner/headliner';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class PageRootFeed extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		return (
			<ContentList class="page-home-feed">
				<ContentHeadliner title="Everything" name="feed" icon="feed" flagclass="-col-ab" childclass="" />
				<ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} />
			</ContentList>
		);
	}

//				<ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
}
