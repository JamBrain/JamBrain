import {h, Component}					from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class PageRootFeed extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		return (
			<ContentList class="page-home-feed">
				<ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} />
			</ContentList>
		);
	}

//				<ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
}
