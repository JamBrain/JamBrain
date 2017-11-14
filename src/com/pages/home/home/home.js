import {h, Component} from 'preact/preact';

import ContentTimeline					from 'com/content-timeline/timeline';


export default class HomeHome extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        return (
            <ContentTimeline types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra}>
                <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
            </ContentTimeline>
        );
    }
}
