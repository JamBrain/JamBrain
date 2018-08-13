import {h, Component}					from 'preact/preact';

import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentHeadlinerFeed				from 'com/content-headliner/headliner-feed';
import TimelineRateGames				from 'com/content-timeline/timeline-rategames';

export default class PageRootHome extends Component {
    render( props ) {
        const {node, user, path, extra, featured} = props;

        let ShowHomework = null;
		if ( user && user.id && featured && featured.focus ) { //&& props.user.focus && props.user.node.what_node[props.user.focus].published && props.featured && props.featured.meta['can-grade'] && (props.meta['can-grade'] == "1") ) {
			if ( (featured.meta['can-grade'] == "1") && featured.what_node && featured.what_node[featured.focus] && featured.what_node[featured.focus].published ) {
				ShowHomework = <TimelineRateGames featured={props.featured} />;
			}
		}

        return (
            <ContentList class="page-home-home">
                <ContentHeadlinerFeed node={node} types={['post']} subtypes={['news']} methods={['all']} limit={1} name="news" icon="news" class="-col-c" published love comments more="/news" />
				{ShowHomework}
                <ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} featured={featured} />
            </ContentList>
        );
    }
//                <ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
//                <ContentHeadliner node={[node, node]} />
}
