import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';
import ContentGroup						from 'com/content-group/group';

export default class PageEvents extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <LayoutSidebar {...props}>
                <div id="content">
                    <ContentGroup node={node} user={user} path={path} extra={extra} />
                </div>
            </LayoutSidebar>
        );
    }
}
