import { h, Component }					from 'preact/preact';

import ContentPost						from 'com/content-post/post';

import ContentUsers						from 'com/content-users/users';
import ContentUser						from 'com/content-user/user';
//import ContentUserGames                 from 'com/content-user/user-games';
import ContentUserFollowing             from 'com/content-user/user-following';
import ContentUserFollowers             from 'com/content-user/user-followers';

import ContentTimeline					from 'com/content-timeline/timeline';
import ContentGames						from 'com/content-games/games';
import ContentEvent						from 'com/content-event/event';
//import ContentEvents					from 'com/content-events/events';
import ContentGroup						from 'com/content-group/group';
import ContentError						from 'com/content-error/error';
import ContentItem						from 'com/content-item/item';

import ContentComments					from 'com/content-comments/comments';

import ContentNavRoot					from 'com/content-nav/nav-root';
import ContentNavUser					from 'com/content-nav/nav-user';
import ContentNavItem					from 'com/content-nav/nav-item';
import ContentNavEvent					from 'com/content-nav/nav-event';
import ContentNavTheme					from 'com/content-nav/nav-theme';

import ContentEventTheme				from 'com/content-event/event-theme';

import ContentPalette					from 'com/content-palette/palette';

import NavLink							from 'com/nav-link/link';
import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';


export default class ViewContent extends Component {
	constructor( props ) {
		super(props);
	}

	getContent( {node, user, path, extra, featured} ) {
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
			var ShowNav = null;
			var ShowFeed = null;
			if ( extra && (extra.length == 0 || extra[0] != 'edit') ) {
				ShowNav = <ContentNavItem node={node} user={user} path={path} extra={extra} />;
				ShowFeed = <ContentComments node={node} user={user} path={path} extra={extra} />;
			}

			return (
				<div id="content">
					<ContentItem node={node} user={user} path={path} extra={extra} featured={featured} />
					{ShowNav}
					{ShowFeed}
				</div>
			);
		}
		else if ( node.type === 'user' ) {
			let View = [];
			let ViewType = null;

			if ( extra.length ) {
				ViewType = extra[0];
			}
			else {
				// Default View (i.e. URL is `/`)
				/*if ( node['games'] > 0 ) //Disabled games as default as api needs work
					ViewType = 'games';
				else*/ if ( node['articles'] > 0 )
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
					if ( ViewType == 'articles' ) {
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentTimeline types={['page']} methods={['author']} node={node} user={user} path={path} extra={extra} />);
					}
					else if ( ViewType == 'feed' ) {
						let Methods = ['author'];
						if ( node.id == user.id )
							Methods.push('unpublished');

						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentTimeline types={['post']} methods={Methods} node={node} user={user} path={path} extra={extra} />);
					}
					else if ( ViewType == 'post' ) {
//						View.push(<ContentPost node={node} user={user} path={path} extra={extra.splice(1)} by love edit />);
					}
					else if ( ViewType == 'games' ) {
						let SubSubType = null;
						if ( extra && extra.length > 1 ) {
							if ( extra[1] != 'all' )
								SubSubType = extra[1];
						}
						
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} />);
						View.push(<ContentGames node={node} user={user} path={path} extra={extra} methods={['authors']} subsubtypes={SubSubType ? SubSubType : ""} />);
					}
					else if ( ViewType == 'article' ) {

					}
					else if ( ViewType == 'following'){
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} featured={featured} />);
						View.push(<ContentUserFollowing node={node} user={user} path={path} extra={extra} featured={featured} />);
					}
					else if ( ViewType == 'followers'){
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} featured={featured} />);
						View.push(<ContentUserFollowers node={node} user={user} path={path} extra={extra} featured={featured} />);
					}
					else {
						View.push(<ContentError />);
					}
				}
				if ( !View.length ) {
					View.push(<ContentError />);
				}
			}

			return (
				<div id="content">
					<ContentUser node={node} user={user} path={path} extra={extra}/>
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
			var ShowInfo = null;
			var ShowPage = null;

			if ( extra && extra.length && extra[0] == 'theme' ) {
				let NewPath = path+'/'+extra[0];
				let NewExtra = extra.slice(1);
				ShowNav = <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
				ShowPage = <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
			}
			else if( extra && extra.length && extra[0] == 'games' ){
				let SubSubType = 'compo+jam';	// alphabetical
				if ( extra && extra.length > 1 ) {
					if ( extra[1] != 'all' )
						SubSubType = extra[1];
				}
				
//				ShowInfo = (
//					<ContentCommon node={node}>
//						<ContentCommonBody>{"Sorry, these aren't sorted correctly yet. For now, try "}<strong><NavLink href="http://feedback.ld.intricati.com/">Feedback Friends</NavLink></strong>.</ContentCommonBody>
//					</ContentCommon>
//				);
				ShowPage = <ContentGames node={node} user={user} path={path} extra={extra} noevent methods={['parent','smart']} subsubtypes={SubSubType ? SubSubType : null} />;
			}
			else {
				//ShowNav = <ContentNavEvent node={node} user={user} path={path} extra={extra} />;
			}

			return (
				<div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} />
					{ShowNav}
					{ShowInfo}
					{ShowPage}
				</div>
			);
		}
		else if ( node.type === 'events' || node.type === 'group' ) {
			return <div id="content"><ContentGroup node={node} user={user} path={path} extra={extra} /></div>;
		}
		else if ( node.type === 'root' ) {
			var ShowNavRoot = <ContentNavRoot node={node} user={user} path={path} extra={extra} />;

			let Viewing = '/'+ (extra ? extra.join('/') : '');
			if ( Viewing == '/' ) {
				Viewing = '/news';
				if ( user && user.id ) {
					Viewing = '/feed';
				}
			}

			if ( Viewing == '/news' ) {
				return <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
			else if ( Viewing == '/hot' ) {
				return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
//			else if ( Viewing == '/games' ) {
			else if ( extra && extra.length && extra[0] == 'games' ) {
				let DefaultSubFilter = 'all';
				let DefaultFilter = 'smart';

				let MappingTable = {
					'all': 'compo+jam+craft+release',
					'classic': 'cool',
				};

				if ( MappingTable[DefaultSubFilter] )
					DefaultSubFilter = MappingTable[DefaultSubFilter];
				if ( MappingTable[DefaultFilter] )
					DefaultFilter = MappingTable[DefaultFilter];

				let Methods = [];
				let Filter = DefaultFilter;
				let SubFilter = DefaultSubFilter;

				if ( extra.length > 2 )
					SubFilter = extra[2];
				if ( extra.length > 1 )
					Filter = extra[1];

				// Determine Filter
				if ( MappingTable[Filter] )
					Filter = MappingTable[Filter];
				if ( Filter.indexOf('-') == -1 ) {		// should be '+'
					switch ( Filter ) {
						case 'smart':
						case 'cool':
						case 'danger':
						case 'grade':
						case 'feedback':
							Methods = [Filter];
							break;

						case 'jam':
						case 'compo':
						case 'craft':
						case 'late':
						case 'release':
						case 'unfinished':
							SubFilter = Filter;
							Methods = [DefaultFilter];
							break;

						default:
							Methods = ['null'];
							break;
					}
				}
				else {
					// If '+' was found, assume it's a multi-part subfilter and not a filter
					SubFilter = Filter.split('-');		// should be '+'
					Methods = [DefaultFilter];
				}

				// Determine SubFilter
				if ( MappingTable[SubFilter] )
					SubFilter = MappingTable[SubFilter];
				
				return (
					<div id="content">
						{ShowNavRoot}
						<ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} subsubtypes={SubFilter ? SubFilter : null} />
					</div>
				);
//						<div>Filter: {Filter}</div>
//						<div>Method: {Methods}</div>
//						<div>SubFilter: {SubFilter}</div>
			}
			else if ( Viewing == '/feed' ) {
				return (
					<ContentTimeline types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra}>
						{ShowNavRoot}
						<ContentTimeline types={['post']} subtypes={['news']} methods={['all']} minimized nomore limit={1} node={node} user={user} path={path} extra={extra} />
					</ContentTimeline>
				);
			}
			else if ( Viewing == '/palette' ) {
				return <div id="content"><ContentPalette node={node} user={user} path={path} extra={extra} /></div>;
			}
			else {
				return <div id="content"><ContentError user={user} path={path} extra={extra}>{Viewing} not found .</ContentError></div>;
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
