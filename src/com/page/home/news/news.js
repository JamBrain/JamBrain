import {h, Component}					from 'preact/preact';
import ContentTimeline					from 'com/content-timeline/timeline';
import UIButton							from 'com/ui/button/button';

export default class PageHomeNews extends Component {

	userCanCreateNews( user ) {
		return user && user.meta && user.meta.group && user.meta.group.filter(g => g == 'canNews').length > 0;
	}

	userCanCreateEventNews( user ) {
		return user && user.meta && user.meta.group && user.meta.group.filter(g => g == 'canNews' || g == 'activeEventHost').length > 0;
	}

    render( props ) {
        let {node, user, path, extra} = props;
		let ShowCreateNews = null;
		let ShowCreteEventNews = null;
		if (this.userCanCreateNews(user)) {
			ShowCreateNews = <UIButton href="/add/0/post/news">Create general news post</UIButton>;
		}
		if (this.userCanCreateEventNews(user)) {
			ShowCreteEventNews = <UIButton href="/add/0/post/news">Create event news post</UIButton>;
		}
        return (
			<div>
				{ShowCreateNews}
				{ShowCreteEventNews}
				<ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
			</div>
        );
    }
}
