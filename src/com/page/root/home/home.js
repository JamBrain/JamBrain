import {Component}			from 'preact';

import ContentEvent						from "com/content-event/event";
//import ContentList						from 'com/content-list/list';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentHeadlinerEvent			from 'com/content-headliner/headliner-event';
import ContentHeadlinerFeed				from 'com/content-headliner/headliner-feed';
import TimelineRateGames				from 'com/content-timeline/timeline-rategames';

export default class PageRootHome extends Component {
	render( props ) {
		const {node, user, path, extra, featured} = props;

		let ShowEvent = null;
		/*
		if ( featured ) {
			// If not logged in or I don't have a game in the current event (focus_id)
			if ( !user || !user.id || !featured.focus_id ) {
				ShowEvent = <ContentEvent node={featured} user={user} path={path} extra={extra} featured={featured} />;
			}
			// Give the abbreviated view
			else {
				ShowEvent = <ContentHeadlinerEvent node={featured} name="event" icon="trophy" flagclass="-col-ab" childclass="-col-a -inv-lit" style="--headlinerSize: 2.5rem;" />;
			}
		}
		*/

		let ShowNews = <ContentHeadlinerFeed node={node} types={['post']} subtypes={['news']} methods={['all']} limit={1} name="news" icon="news" flagclass="-col-c -inv -inv-lit" childclass="-col-c" published love comments href="/news" />;

		let ShowHomework = null;
		// Only show homework if you're logged in and you have a game in the current event
		if ( user && user.id && featured && featured.focus_id ) {
			if ( (featured.meta['can-grade'] == "1") && featured.what && featured.what[featured.focus_id] && featured.what[featured.focus_id].published ) {
				ShowHomework = <TimelineRateGames featured={props.featured} />;
			}
		}

		let ShowPosts = <ContentTimeline class="content-timeline-posts" types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra} featured={featured} />;

		return (
			<>
				{ShowEvent}
				{ShowNews}
				{ShowHomework}
				{ShowPosts}
			</>
		);
	}
//                <ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
//                <ContentHeadliner node={[node, node]} />
}
