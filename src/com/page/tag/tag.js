import {h, Component} from 'preact/preact';

import ContentGames						from 'com/content-games/games';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

export default class PageTag extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, path, extra} = props;

        let Methods = ['target'];
        return (
            <div id="content">
                <Common node={node} user={user} >
                    <CommonBody><h2>Tag: {node.name}</h2></CommonBody>
                </Common>
                <ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} tags={node.id} />
            </div>
        );
    }
}
