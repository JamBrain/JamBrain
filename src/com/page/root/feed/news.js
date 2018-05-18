import {h, Component}					from 'preact/preact';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class PageRootFeedNews extends Component {
    render( props ) {
        let {node, user, path, extra} = props;

        return (
            <ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
        );
    }
}
