import {h, Component}					from 'preact/preact';
import ContentTimeline					from 'com/content-timeline/timeline';
import UIButton							from 'com/ui/button/button';
import DialogCreate						from 'com/dialog/create/create';

export default class PageHomeNews extends Component {

	constructor (props) {
		super(props);

		this.onCreateGeneralNews = this.onCreateNews.bind(this, "general");
		this.onCreateEventNews = this.onCreateNews.bind(this, "event");
		this.onAbortCreate = this.onAbortCreate.bind(this);
	}

	onCreateNews(newsType) {
		this.setState({'showDialog': newsType});
	}

	onAbortCreate() {
		this.setState({'showDialog': null});
	}

	userCanCreateNews( user ) {
		return user && user.meta && user.meta.group && user.meta.group.filter(g => g == 'canNews').length > 0;
	}

	userCanCreateEventNews( user ) {
		return user && user.meta && user.meta.group && user.meta.group.filter(g => g == 'canNews' || g == 'activeEventHost').length > 0;
	}

    render( props, state ) {
        const {node, user, path, extra, featured} = props;
		const {showDialog} = state;
		let ShowCreateNews = null;
		let ShowCreteEventNews = null;
		let ShowDialog = null;
		if (showDialog) {
			const extra = [];
			if (showDialog == 'general') {
				extra.push(1);
			}
			else {
				extra.push(featured.id);
			}
			extra.push('post');
			extra.push('news');
			ShowDialog = <DialogCreate extra={extra} onAbort={this.onAbortCreate}/>;
		}
		if (this.userCanCreateNews(user)) {
			ShowCreateNews = <UIButton onClick={this.onCreateGeneralNews}>Create general news post</UIButton>;
		}
		if (featured && this.userCanCreateEventNews(user)) {
			ShowCreteEventNews = <UIButton onClick={this.onCreateEventNews}>Create event news post</UIButton>;
		}
        return (
			<div>
				{ShowCreateNews}
				{ShowCreteEventNews}
				<ContentTimeline class="content-timeline-news" types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
				{ShowDialog}
			</div>
        );
    }
}
