import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';
import ContentPost						from 'com/content-post/post';

export default class PagePage extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <LayoutSidebar {...props}>
                <div id="content">
					<ContentPost node={node} user={user} path={path} extra={extra} updated />
				</div>
            </LayoutSidebar>
        );
    }
}
