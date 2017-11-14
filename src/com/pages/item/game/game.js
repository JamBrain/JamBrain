import {h, Component} from 'preact/preact';

import ContentComments					from 'com/content-comments/comments';
import ContentNavItem					from 'com/content-nav/nav-item';
import ContentItem						from 'com/content-item/item';

export default class PageItemGame extends Component {
    render( props, state ) {
        let {node, user, featured, path, extra} = props;

        let EditMode = extra && extra.length && (extra[extra.length-1] == 'edit');

        var ShowNav = null;
        var ShowFeed = null;
        if ( extra && ((extra.length == 0) || (extra[0] != 'edit')) ) {
            ShowNav = <ContentNavItem node={node} user={user} path={path} extra={extra} />;
            ShowFeed = <ContentComments node={node} user={user} path={path} extra={extra} />;
        }

        return (
            <div id="content">
                <ContentItem node={node} user={user} path={path} extra={extra} featured={featured} />
                {ShowNav}
                {ShowFeed}
            </div>
        );
    }
}
