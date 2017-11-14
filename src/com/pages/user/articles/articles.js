import {h, Component} from 'preact/preact';

import ContentTimeline					from 'com/content-timeline/timeline';

export default class UserArticles extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, path, extra} = props;

        return (
            <ContentTimeline types={['page']} methods={['author']} node={node} user={user} path={path} extra={extra} />
        );
    }
}
