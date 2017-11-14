import {h, Component} from "preact/preact";

import ContentEvent						from "com/content-event/event";
import ContentNavEvent					from "com/content-nav/nav-event";
import ContentNavTheme					from "com/content-nav/nav-theme";

import ContentError						from "com/content-error/error";

import Router from "com/router/router";
import Route from "com/router/route";

import EventStats from "./stats/stats";
import EventTheme from "./theme/theme";
import EventGames from "./games/games";

export default class PageEvent extends Component {
    constructor( props ) {
        super(props);
    }

    render( props, state ) {
        let {node, user, featured, path, extra, error} = props;

        let DefaultSubFilter = "all";
        let DefaultFilter = "smart";

        // Results
        if ( node && node.meta && (node.meta["theme-mode"] >= 8) ) {
            DefaultSubFilter = "jam";//"all";
            DefaultFilter = "overall";
        }

        let NewPath = path + "/" + extra[0];
        let NewExtra = extra.slice(1);

        return (
            <div id="content">
				<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} />
                <Router node={node} props={props}>
                    <Route default static path="/stats" component={EventStats} />
                    <Route static path="/theme/:page?" component={EventTheme} />
                    <Route static path={["/games/:filter?/:subfilter?", "/results/:filter?/:subfilter?"]} component={EventGames} />

                    <Route type="error" component={ContentError} />
                </Router>
			</div>
        );
    }
}
