import {Component}			from 'preact';
import ContentHeadliner					from 'com/content-headliner/headliner';

//import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class PageRootFeedNews extends Component {
    render( props ) {
        let {node, user, path, extra} = props;

        return (
			<>
				<ContentHeadliner title="All News" name="feed" icon="feed" flagclass="-col-ab" childclass="" />
                <ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
            </>
        );
    }
}
