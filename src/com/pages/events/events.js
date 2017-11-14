import {h, Component} from 'preact/preact';

import ContentGroup						from 'com/content-group/group';

export default class PageEvents extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <div id="content">
                <ContentGroup node={node} user={user} path={path} extra={extra} />
            </div>
        );
    }
}
