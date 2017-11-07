import {h, Component} from 'preact/preact';

export default class UserFollowers extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <ContentUserFollowers node={node} user={user} path={path} extra={extra} featured={featured} />
        );
    }
}
