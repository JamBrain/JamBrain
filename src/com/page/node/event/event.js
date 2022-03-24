import {h, Component, Fragment} from "preact";
import PageNavEvent						from 'com/page/nav/event';

import ContentHeadlinerEvent			from 'com/content-headliner/headliner-event';
import ContentNavEvent					from "com/content-nav/nav-event";
import ContentNavTheme					from "com/content-nav/nav-theme";

import {ContentRouter, Route} from "com/router";
//import Route							from "com/router/route";

import EventHome						from "./home/home";
import EventStats						from "./stats/stats";
import EventTheme						from "./theme/theme";
import EventGames						from "./games/games";

import EventMy							from "./my/my";
import EventMyGrades					from "./mygrades/mygrades";


export default class PageEvent extends Component {
	render( props, state ) {
		let {node, user, featured, path, extra} = props;

		if ( !node ) return null;

		let IsThisFeatured = featured && (node.id == featured.id);

		let DefaultSubFilter = "all";
		let DefaultFilter = "smart";

		// Results
		if ( node && node.meta && (node.meta["event-mode"] >= 8) ) {
			DefaultSubFilter = "jam";//"all";
			DefaultFilter = "overall";
		}

		let NewPath = path + "/" + extra[0];
		let NewExtra = extra.slice(1);

//				<ContentNavEvent node={node} user={user} path={path} extra={extra} featured={featured} />

		return (
			<Fragment>
				<ContentHeadlinerEvent node={node} name="event" icon="trophy" flagclass="-col-ab" childclass={IsThisFeatured ? "-col-a -inv-lit" : "-inv -inv-lit"} style="--headlinerSize: 2.5rem;" />
				<PageNavEvent {...props} />
				<ContentRouter props={props} key="event">
					<Route path="/" component={EventHome} />
					<Route path="/stats/*" component={EventStats} />
					<Route path="/theme/*" component={EventTheme} />
					<Route path={["/games/:filter?/:subfilter?", "/results/:filter?/:subfilter?"]} component={EventGames} />
					<Route path="/my" user={user} component={EventMy}>
						<Route path="/grades" component={EventMyGrades} />
					</Route>
				</ContentRouter>
			</Fragment>
		);
	}
}
