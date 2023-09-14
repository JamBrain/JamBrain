import { Component } 					from 'preact';
import './user-bar.less';

import ContentCommonNav					from 'com/content-common/common-nav';
import CommonButton						from 'com/content-common/common-nav-button';
import CommonButtonFollow				from 'com/content-common/common-nav-button-follow';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

export default class ContentUserBar extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var user = props.user;
		var node = props.node;
		var featured = props.featured;
//		var games =  node.games;
//		var articles = node.articles;
//		var posts = node.posts;

		var ShowFollow = null;

		if ( user && user.id ) {
			ShowFollow = <CommonButtonFollow node={node} user={user} />;

			// Only team leaders can add team members
			if ( featured && featured.focus_id && featured.what && featured.what[featured.focus_id] && featured.what[featured.focus_id].author == user.id ) {
				// You can only add friends
			}
		}

		if ( node && user ) {
			const href = "/users/" + node.slug;

			return (
				<div class="content-user-bar">
					<ContentCommonBodyAvatar href={href} src={node.meta && node.meta.avatar ? node.meta.avatar : ''} />
					<ContentCommonBodyTitle href={href} title={node.meta['real-name'] ? node.meta['real-name'] : node.name} subtitle={'@'+node.slug} />

					<ContentCommonNav>
						{ShowFollow}
					</ContentCommonNav>
				</div>
			);
		}

		return null;
	}
}
