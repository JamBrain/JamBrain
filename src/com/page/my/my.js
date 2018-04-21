import {h, Component}					from "preact/preact";

import ContentError						from "com/content-error/error";

import Router							from "com/router/router";
import Route							from "com/router/route";

import MyHome							from "./home";
import MySettings						from "./settings";
import MyNotifications					from "./notifications";
import MyStats							from "./stats";


export default class PageEvent extends Component {
    render( props, state ) {
        let {node, user, featured, path, extra} = props;

        let NewPath = path + "/" + extra[0];
        let NewExtra = extra.slice(1);

        return (
            <div id="content">
				<div>TODO: My page</div>
                <Router node={node} props={props}>
                    <Route default static path="/home" component={MyHome} />
                    <Route static path="/settings" component={MySettings} />
                    <Route static path="/notifications" component={MyNotifications} />
                    <Route static path="/stats" component={MyStats} />
                    <Route type="error" component={ContentError} />
                </Router>
			</div>
        );
    }
}
