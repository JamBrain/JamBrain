import {h, Component} from 'preact/preact';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class HomeFeed extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        return (
            <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
        );
    }
}
