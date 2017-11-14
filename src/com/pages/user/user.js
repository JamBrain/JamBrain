import {h, Component} from 'preact/preact';

import ContentUser						from 'com/content-user/user';
import ContentNavUser					from 'com/content-nav/nav-user';
import ContentError						from 'com/content-error/error';

import UserFeed from './feed/feed';
import UserArticles from './articles/articles';
import UserGames from './games/games';
import UserFollowing from './following/following';
import UserFollowers from './followers/followers';

import Router from 'com/router/router';
import Route from 'com/router/route';

export default class PageUser extends Component {
    render( props, state ) {
        let {node, user,path, extra} = props;

        let articlesDefault = node['articles'] > 0 ? true : false;
        let ShowNav = (<ContentNavUser node={node} user={user} path={path} extra={extra} />);
        let editing = extra[extra.length - 1] == "edit";

        if ( editing ) {
            ShowNav = null;
        }

        return (
            <div id="content">
                {ShowNav}
                <ContentUser node={node} user={user} path={path} extra={extra}/>
                <Router node={node} props={props}>
                    <Route default={!articlesDefault} static path="/feed" component={UserFeed} />
                    <Route default={articlesDefault} static path="/articles" component={UserArticles} />
                    <Route static path="/games" component={UserGames} />
                    <Route static path="/following" component={UserFollowing} />
                    <Route static path="/followers" component={UserFollowers} />
                    <Route static path="/edit" />
                    <Route type="error" component={ContentError} />
                </Router>
            </div>
        );
    }
}
