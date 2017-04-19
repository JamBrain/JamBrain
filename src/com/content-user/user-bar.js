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
		var following = props.node;
		var games =  following.games;
		var articles = following.articles;
		var posts = following.posts;
		
		var ShowAddToTeam = null;
		if ( true ) {
			ShowAddToTeam = (
				<CommonButton class="-disabled" node={following} user={user}>
					<SVGIcon>pushpin</SVGIcon><div>Add to Team</div>
				</CommonButton>
			);
		}

		return (
			<div class="content-user-bar">
				<ContentCommonBodyAvatar src={following.meta && following.meta.avatar ? following.meta.avatar : ''} />
				<ContentCommonBodyTitle href={"/users/"+following.slug} title={following.meta['real-name'] ? following.meta['real-name'] : following.name} subtitle={'@'+following.slug} />

				<ContentCommonNav>
					<CommonButtonFollow node={following} user={user} />
					{ShowAddToTeam}
				</ContentCommonNav>
			</div>
		);
	}
}
