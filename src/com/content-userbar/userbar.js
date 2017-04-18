import { h, Component } 				from 'preact/preact';

import ContentCommonNav					from 'com/content-common/common-nav';
import ButtonFollow						from 'com/content-common/common-nav-button-follow';

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

        return (
                <div class="userbar">
                    <ContentCommonBodyAvatar src={following.meta && following.meta.avatar ? following.meta.avatar : ''} />
                    <ContentCommonBodyTitle href={"/#dummy"} title={following.meta['real-name'] ? following.meta['real-name'] : following.name} subtitle={'@'+following.slug} />

                    <ContentCommonNav><ButtonFollow node={following} user={user} /></ContentCommonNav>
                </div>

        );
    }
}
