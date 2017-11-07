import {h, Component} from 'preact/preact';

export default class UserFeed extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let Methods = ['author'];
        if ( node.id == user.id ) {
            Methods.push('unpublished');
        }

        return (
            <ContentTimeline types={['post']} methods={Methods} node={node} user={user} path={path} extra={extra} />
        );
    }
}
