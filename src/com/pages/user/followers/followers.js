import {h, Component} from 'preact/preact';

import ContentUserFollowers from 'com/content-user/user-followers';

export default class UserFollowers extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentUserFollowers node={node} user={user} path={path} extra={extra} featured={featured} />
        );
    }
}
