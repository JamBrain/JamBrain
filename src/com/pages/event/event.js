import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';

export default class PageEvent extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let DefaultSubFilter = 'all';
        let DefaultFilter = 'smart';

        // Results
        if ( node && node.meta && node.meta['theme-mode'] >= 8 ) {
            DefaultSubFilter = 'jam';//'all';
            DefaultFilter = 'overall';
        }

        return (
            <LayoutSidebar {...props}>
                <div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} />
                    <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />
                    <Router node={node} props={{...props}} path={extra}>
                        <Route default static path="/stats" component={EventStats} />
                        <Route static path="/theme" component={EventTheme} />
                        <Route static path={["/games", "/results"]} component={EventGames} />
                    </Router>
				</div>
            </LayoutSidebar>
        );
    }
}
