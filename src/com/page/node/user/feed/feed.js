import {h, Component} from 'preact/preact';

import ContentTimeline					from 'com/content-timeline/timeline';

export default class UserFeed extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, path, extra} = props;

        let Methods = ['author'];
        if ( node.id == user.id ) {
            Methods.push('unpublished');
        }

        return (
            <ContentTimeline types={['post']} methods={Methods} node={node} user={user} path={path} extra={extra} />
        );
    }
}
