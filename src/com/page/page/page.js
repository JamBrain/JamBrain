import {h, Component} from 'preact/preact';

import ContentPost						from 'com/content-post/post';

export default class PagePage extends Component {
    render( props, state ) {
        let {node, user, path, extra} = props;

        return (
            <div id="content">
				<ContentPost node={node} user={user} path={path} extra={extra} updated />
			</div>
        );
    }
}
