import {h, Component} from 'preact/preact';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class HomeFeed extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        console.log("news");

        return (
            <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra} />
        );
    }
}
