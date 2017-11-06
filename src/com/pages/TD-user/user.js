import {h, Component} from 'preact/preact';

import LayoutSidebar from 'com/layouts/sidebar/sidebar';

import UserFeed from './feed/feed';
import UserArticles from './articles/articles';
import UserGames from './games/games';
import UserFollowing from './following/following';
import UserFollowers from './followers/followers';

import Router from 'com/router/router';
import Route from 'com/router/route';

export default class PageUser extends Component {
    constructor( props ) {}

    render( props, state ) {
        let {node, user, featured, path, extra, error, home} = props;

        let articlesDefault = node['articles'] > 0 ? true : false;
        // let loggedIn = user.id ? true : false;
        // <Route default={loggedIn} static path="/feed" />
        // <Route default={loggedIn} static path="/home" />
        return (
            <LayoutSidebar {...props}>
                <ContentUser node={node} user={user} path={path} extra={extra}/>
                <ContentNavUser node={node} user={user} path={path} extra={extra} />
                <Router node={node} props={{...props}} path={extra}>
                    <Route default={!articlesDefault} static path="/feed" component={UserFeed} />
                    <Route default={articlesDefault} static path="/articles" component={UserArticles} />
                    <Route static path="/games" component={UserGames} />
                    <Route static path="/following" component={UserFollowing} />
                    <Route static path="/followers" component={UserFollowers} />
                </Router>
            </LayoutSidebar>
        );
    }
}
