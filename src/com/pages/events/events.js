import {h, Component} from 'preact/preact';

import ContentGroup						from 'com/content-group/group';

export default class PageEvents extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        return (
            <div id="content">
                <ContentGroup node={node} user={user} path={path} extra={extra} />
            </div>
        );
    }
}
