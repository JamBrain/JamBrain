import {h, Component} from 'preact/preact';

import ContentGames						from 'com/content-games/games';

export default class UserGames extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let GamesFeedFilter = null;

        let SubSubType = null;
        if ( extra && extra.length > 1 ) {
            if ( extra[1] != 'all' )
                SubSubType = extra[1];
        }

        return (
            <ContentGames node={node} user={user} path={path} extra={extra} methods={['authors']} subsubtypes={SubSubType ? SubSubType : ""} filter={GamesFeedFilter} />
        );
    }
}
