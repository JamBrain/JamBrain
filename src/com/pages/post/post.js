import {h, Component} from 'preact/preact';

import ViewContentPost from 'content-post';

export default class PagePost extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        if ( extra && ((extra.length == 0) || (extra[0] != 'edit')) ) {

        return (
            <ViewContentPost node={node} user={user} path={path} extra={extra} edit={EditMode} />
        );
    }
}
