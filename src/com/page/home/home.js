import {h, Component}					from 'preact/preact';

import Router							from 'com/router/router';
import Route							from 'com/router/route';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentError						from 'com/content-error/error';

import HomeFeed							from './feed/feed';
import HomeHome							from './home/home';
import HomeNews							from './news/news';
import HomeGames						from './games/games';

export default class PageHome extends Component {
    constructor( props ) {
        super(props);
    }

    render( props ) {
        let {node, user, path, extra} = props;
        let loggedIn = user && (user.id !== 0);

        return (
            <div id="content">
                <ContentNavRoot node={node} user={user} path={path} extra={extra} />
                <Router node={node} props={props}>
                    <Route default={!loggedIn} static path="/feed" component={HomeFeed}/>
                    <Route default={loggedIn} static path="/home" component={HomeHome}/>
                    <Route static path="/news" component={HomeNews} />
                    <Route static path="/games/:filter?/:subfilter?/:target?" component={HomeGames} />
                    {/* <Route static path="/hot" component={HomeHot} /> */}

                    {/* <Route static path="/palette" component={HomePalette} /> */}
                    <Route type="error" component={ContentError} />
                </Router>
            </div>
        );
    }
}
