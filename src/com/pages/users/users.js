import {h, Component} from 'preact/preact';

import ContentUsers						from 'com/content-user/user';

export default class PageUsers extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <div id="content">
                <ContentUsers node={node} user={user} path={path} extra={extra} />
            </div>
        );
    }
}
