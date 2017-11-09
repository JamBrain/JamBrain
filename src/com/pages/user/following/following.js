import {h, Component} from 'preact/preact';

import ContentUserFollowing from 'com/content-user/user-following';

export default class UserFollowing extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentUserFollowing node={node} user={user} path={path} extra={extra} featured={featured} />
        );
    }
}
