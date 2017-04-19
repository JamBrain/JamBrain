import { h, Component } 				from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';
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
//		var games =  node.games;
//		var articles = node.articles;
//		var posts = node.posts;
		
		var ShowAddToTeam = null;
		if ( true ) {
			ShowAddToTeam = (
				<CommonButton class="-disabled" node={node} user={user}>
					<SVGIcon>pushpin</SVGIcon><div>Add to Team</div>
				</CommonButton>
			);
		}

		return (
			<div class="content-user-bar">
				<ContentCommonBodyAvatar src={node.meta && node.meta.avatar ? node.meta.avatar : ''} />
				<ContentCommonBodyTitle href={"/users/"+node.slug} title={node.meta['real-name'] ? node.meta['real-name'] : node.name} subtitle={'@'+node.slug} />

				<ContentCommonNav>
					<CommonButtonFollow node={node} user={user} />
					{ShowAddToTeam}
				</ContentCommonNav>
			</div>
		);
	}
}
