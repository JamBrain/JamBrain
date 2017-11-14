import {h, Component} from 'preact/preact';

import ContentEventTheme				from 'com/content-event/event-theme';
import ContentNavTheme					from 'com/content-nav/nav-theme';

export default class UserStats extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home, params} = props;

        let NewPath = path+'/'+extra[0];
        let NewExtra = [];

        if ( params && params.page ) {
            NewExtra = [params.page];
        }

        return (
            <div>
                <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />
                <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />
            </div>
        );
    }
}
