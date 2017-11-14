import {h, Component} from 'preact/preact';

import ViewContentPost from 'content-post';

export default class PagePost extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let EditMode = extra && extra.length && extra[extra.length-1] == 'edit';

        return (
            <ViewContentPost node={node} user={user} path={path} extra={extra} edit={EditMode} />
        );
    }
}
