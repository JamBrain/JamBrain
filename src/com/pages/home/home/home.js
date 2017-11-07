import {h, Component} from 'preact/preact';

import ContentTimeline					from 'com/content-timeline/timeline';


export default class HomeHome extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        var ShowHome = <h1>Home!</h1>;

        return (
            <ContentTimeline types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra}>
                {ShowHome}
                <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
            </ContentTimeline>
        );
    }
}
