import {h, Component}					from "preact/preact";

import ContentError						from "com/content-error/error";

import Router							from "com/router/router";
import Route							from "com/router/route";

import MyHome							from "./home";
import MyNotifications					from "./notifications";
import MyStats							from "./stats";
import MySettings						from "./settings";


export default class PageMy extends Component {
	render( props ) {
		return (
			<div>
				<div>Cvest</div>
				<Router node={props.node} props={props} name="my">
					<Route static path="/my" component={MyHome}>
						<Route static path="/notifications" component={MyNotifications} />
						<Route static path="/stats" component={MyStats} />
						<Route static path="/settings" component={MySettings} />
					</Route>
					<Route type="error" component={ContentError} />
				</Router>
				<div>Cvast</div>
			</div>
		);
	}
}
