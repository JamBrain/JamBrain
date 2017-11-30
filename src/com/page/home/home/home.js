import {h, Component}					from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentHeadlinerFeed				from 'com/content-headliner/headliner-feed';

export default class PageHomeHome extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		return (
			<ContentList class="page-home-home">
				<ContentHeadlinerFeed node={node} types={['post']} subtypes={['news']} methods={['all']} limit={1} name="news" icon="news" class="-col-c" published love comments more="/news" />
				<ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} />
			</ContentList>
		);
	}
//				<ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
//				<ContentHeadliner node={[node, node]} />
}
