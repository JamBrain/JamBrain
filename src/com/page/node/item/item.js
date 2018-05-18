import {h, Component}					from 'preact/preact';
import PageNavContent					from '../../nav/content';

import ContentComments					from 'com/content-comments/comments';
import ContentNavItem					from 'com/content-nav/nav-item';
import ContentItem						from 'com/content-item/item';

export default class PageItem extends Component {
	render( props, state ) {
		let {node, user, featured, path, extra} = props;

		let EditMode = extra && extra.length && (extra[extra.length-1] == 'edit');

		let ShowNav = null;
		let ShowComments = null;
		if ( extra && ((extra.length == 0) || (extra[0] != 'edit')) ) {
			ShowNav = <ContentNavItem node={node} user={user} path={path} extra={extra} />;
			ShowComments = <ContentComments node={node} user={user} path={path} extra={extra} />;
		}

		return (
			<div id="content">
				<PageNavContent {...props} />
				<ContentItem {...props} />
				{ShowNav}
				{ShowComments}
			</div>
		);
	}
}
