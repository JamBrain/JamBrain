import { h, Component } 				from 'preact/preact';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

export default class ContentUserBar extends Component {
	constructor( props ) {
		super(props);

    }


    render( props ) {

        console.log("userbar props");
        console.log(props);
        console.log(props.user + ", " + props.user.name);

        var user = props.user;
        var games =  user.games;
        var articles = user.articles;
        var posts = user.posts;



        return (
                <div class="userbar">
                    <ContentCommonBodyAvatar src={user.meta && user.meta.avatar ? user.meta.avatar : ''} />
                    <ContentCommonBodyTitle href={"/#dummy"} title={user.meta['real-name'] ? user.meta['real-name'] : user.name} subtitle={'@'+user.slug} />

                    <div class="info">
                        <span> {games} Games </span>
                        <span> {articles} Articles </span>
                        <span> {posts} Posts </span>
                    </div>
                </div>

        );
    }
}
