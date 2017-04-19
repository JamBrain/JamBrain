import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';
import ContentUser						from 'com/content-user/user';
import ContentUsers						from 'com/content-users/users';
import ContentTimeline					from 'com/content-timeline/timeline';
import ContentGames						from 'com/content-games/games';
import ContentEvent						from 'com/content-event/event';
//import ContentEvents					from 'com/content-events/events';
import ContentGroup						from 'com/content-group/group';
import Content404						from 'com/content-404/404';
import ContentItem						from 'com/content-item/item';

import ContentComments					from 'com/content-comments/comments';

import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentNavUser					from 'com/content-nav/nav-user';
import ContentNavEvent					from 'com/content-nav/nav-event';
import ContentNavTheme					from 'com/content-nav/nav-theme';

import ContentEventTheme				from 'com/content-event/event-theme';

import ContentPalette					from 'com/content-palette/palette';
import ContentUserFollowing             from 'com/content-user/user-following';

export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
	}

	getContent( {node, user, path, extra} ) {
		if ( node.name ) {
			document.title = titleParser.parse(node.name, true);
			if ( document.title === "" )
				document.title = window.location.host;
			else
				document.title += " | " + window.location.host;
		}
		else {
			document.title = window.location.host;
		}

		var EditMode = extra && extra.length && extra[extra.length-1] == 'edit';

		if ( node.type === 'post' ) {
			var Content = [];
			Content.push(<ContentPost node={node} user={user} path={path} extra={extra} authored by love />);

			if ( !EditMode ) {
				Content.push(<ContentComments node={node} user={user} path={path} extra={extra} />);
			}

			return (
				<div id="content">
					{Content}
				</div>
			);
		}
		else if ( node.type === 'page' ) {
			return (
				<div id="content">
					<ContentPost node={node} user={user} path={path} extra={extra} updated />
				</div>
			);
		}
		else if ( node.type === 'item' ) {
			return (
				<div id="content">
					<ContentItem node={node} user={user} path={path} extra={extra} />
					<ContentComments node={node} user={user} path={path} extra={extra} />
				</div>
			);
		}
		else if ( node.type === 'user' ) {
			let View = [];
			let ViewType = null;

			if ( extra.length ) {
				ViewType = extra[0];
                console.log(extra[0]);
			}
			else {
				// Default View (i.e. URL is `/`)
				if ( node['games'] > 0 )
					ViewType = 'games';
				else if ( node['articles'] > 0 )
					ViewType = 'articles';
				else
					ViewType = 'feed';
			}

			// When root edit mode is detected
			if ( extra.length && extra[0] == 'edit' ) {
				// Do nothing
			}
			else {
				if ( ViewType ) {
					if ( ViewType == 'games' ) {
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentGames types={['game']} methods={['author']} node={node} user={user} path={path} extra={extra} />);
					}
					else if ( ViewType == 'articles' ) {
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentTimeline types={['page']} methods={['author']} node={node} user={user} path={path} extra={extra} />);
					}
					else if ( ViewType == 'feed' ) {
                        View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentTimeline types={['post']} methods={['author']} node={node} user={user} path={path} extra={extra} />);
					}
					else if ( ViewType == 'post' ) {
//						View.push(<ContentPost node={node} user={user} path={path} extra={extra.splice(1)} by love edit />);
					}
					else if ( ViewType == 'game' ) {
					}
					else if ( ViewType == 'article' ) {
					}
                    else if ( ViewType == 'following'){
                        View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
                        View.push(<ContentUserFollowing node={node} user={user} path={path} extra={extra} />);
                    }
					else {
						View.push(<Content404 />);
					}
				}
				if ( !View.length ) {
					View.push(<Content404 />);
				}
			}

			return (
				<div id="content">
					<ContentUser node={node} user={user} path={path} extra={extra} />
					{View}
				</div>
			);
		}
		else if ( node.type === 'users' ) {
			return (
				<div id="content">
					<ContentUsers node={node} user={user} path={path} extra={extra} />
				</div>
			);
		}
		else if ( node.type === 'event' ) {
			var ShowNav = null;
			var ShowPage = null;

			if ( extra && extra.length && extra[0] == 'theme' ) {
				let NewPath = path+'/'+extra[0];
				let NewExtra = extra.slice(1);
				ShowNav = <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} />;
				ShowPage = <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} />;
			}
			else {
				//ShowNav = <ContentNavEvent node={node} user={user} path={path} extra={extra} />;
			}

//			else {
/*				let Topic = 'news';
				if ( extra.length )
					Topic = extra.length;

				if ( Topic == 'news' ) {
					ShowPage = <ContentTimeline types={['post']} subtypes={['news']} node={node} user={user} path={path} extra={extra}></ContentTimeline>;
				}
				else if ( Topic == 'hot' ) {
					ShowPage = <ContentTimeline node={node} user={user} path={path} extra={extra}></ContentTimeline>;
				}
				else if ( Topic == 'games' ) {
					ShowPage = <ContentGames types={['game']} node={node} user={user} path={path} extra={extra}></ContentGames>;
				}
				else if ( Topic == 'feed' ) {
					ShowPage = <ContentTimeline types='' node={node} user={user} path={path} extra={extra}></ContentTimeline>;
				}*/
//			}

			return (
				<div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} />
					{ShowNav}
					{ShowPage}
				</div>
			);
//					<ContentNavEvent node={node} user={user} path={path} extra={extra} />;
		}
		else if ( node.type === 'events' || node.type === 'group' ) {
			return <div id="content"><ContentGroup node={node} user={user} path={path} extra={extra} /></div>;
		}
		else if ( node.type === 'root' ) {
			var ShowNavRoot = <ContentNavRoot node={node} user={user} path={path} extra={extra} />;

			// If some extra arguments were passed, do virtual children
			if ( extra.length ) {
				if ( extra[0] === 'news' ) {
					return <ContentTimeline types={['post']} subtypes={['news']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'hot' ) {
					return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'games' ) {
					return <ContentGames types={['game']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentGames>;
				}
				else if ( extra[0] === 'feed' ) {
					return <ContentTimeline types='' node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
				}
				else if ( extra[0] === 'palette' ) {
					return <div id="content"><ContentPalette node={node} user={user} path={path} extra={extra} /></div>;
				}
				else {
					return <div id="content"><Content404 user={user} path={path} extra={extra}>{extra[0]} not found</Content404></div>;
				}
			}
			// If logged in, default to the user timeline
			else if ( user && user.id ) {
				return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
			// If not logged in, default to news
			else {
				return <ContentTimeline types={['post']} subtypes={['news']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
		}
		else {
			return <div id="content"><div class='content-base'>Unsupported Node Type: {""+node.type}</div></div>;
		}
	}

	render( props ) {
		if ( props.node ) {
			return this.getContent(props);
		}
		else {
			return <div id="content">{this.props.children}</div>;
		}
	}
};
