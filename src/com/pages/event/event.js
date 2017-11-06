import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';
import Router from 'com/router/router';
import Route from 'com/router/route';

export default class PageEvent extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        return (
            <LayoutSidebar {...props}>
                <div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} />
                    <Router node={node} props={{...props}} path={extra}>
                        <Route default static path="/stats" />
                        <Route static path="/articles" />
                        <Route static path="/games" />
                        <Route static path="/following" />
                        <Route static path="/followers" />
                    </Router>
					{ShowNav}
					{ShowFilters}
					{ShowPage}
				</div>
            </LayoutSidebar>
        );
    }
}
