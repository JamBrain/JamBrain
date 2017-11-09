import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';

import ContentGames						from 'com/content-games/games';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

export default class PageTag extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let GamesFeedFilter = null; //This is undefined on the current site??
        var Methods = ['target'];
        return (
            <LayoutSidebar {...props}>
                <div id="content">
                    <Common node={node} user={user} >
                        <CommonBody><h2>Tag: {node.name}</h2></CommonBody>
                    </Common>
                    <ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} filter={GamesFeedFilter} />
                </div>
            </LayoutSidebar>
        );
    }
}
