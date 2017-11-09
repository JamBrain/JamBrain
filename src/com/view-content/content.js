import {h, Component}					from 'preact/preact';

import ContentPost						from 'com/content-post/post';

import ContentUsers						from 'com/content-users/users';
import ContentUser						from 'com/content-user/user';
//import ContentUserGames                 from 'com/content-user/user-games';
import ContentUserFollowing from 'com/content-user/user-following';
import ContentUserFollowers from 'com/content-user/user-followers';

import ContentTimeline					from 'com/content-timeline/timeline';
import ContentGames						from 'com/content-games/games';
import GamesFilter from 'com/content-games/filter';
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
import ContentStatsEvent				from 'com/content-stats/stats-event';

import ContentPalette					from 'com/content-palette/palette';

import NavLink							from 'com/nav-link/link';
//import SVGIcon							from 'com/svg-icon/icon';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
//import CommonNav						from 'com/content-common/common-nav';
//import CommonNavButton					from 'com/content-common/common-nav-button';

//import HeadMan 							from '../../internal/headman/headman';
//import marked 							from '../../internal/marked/marked';

import ViewContentPost					from 'content-post';

export default class ViewContent extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
//		if(nextProps.node) {
//			this.generateMeta(nextProps.node);
//		}
	}
/*
	generateMeta(node) {
		var metaObject = {"og:type": "website", "og:site_name": "Ludum Dare", "og:url": window.location.href, "twitter:card": "summary", "twitter:site": "@ludumdare"};

		if (node.name) {
			metaObject["og:title"] = node.name;
		} else {
			metaObject["og:title"] = window.location.host;
		}

		if(node.body) {
			metaObject["og:description"] = marked.cleanMarkdown(node.body.substring(0,256));
			metaObject["description"] = marked.cleanMarkdown(node.body.substring(0,256));
		}

		if (node.meta.cover) {
			metaObject["og:image"] = STATIC_ENDPOINT + node.meta.cover;
		} else if (node.type == 'item') {
			if (node.subtype == 'game') {
				metaObject["og:image"] = "http:" + STATIC_ENDPOINT + '/content/internal/tvfail.png.480x384.fit.jpg';
			}
		}

		if(node.type == "user") {
			metaObject["og:type"] = 'profile';
			metaObject["profile:username"] = node.name;
			if (node.meta.avatar) {
				metaObject["og:image"] = "http:" + STATIC_ENDPOINT + node.meta.avatar;
			} else {
				metaObject["og:image"] = "http:" + STATIC_ENDPOINT + '/content/internal/user64.png.64x64.fit.png';
			}
		}

		HeadMan.insertMeta(metaObject);
	}
*/

	getTitle( {node} ) {
		let Title = "";
		if ( node.name ) {
			Title = titleParser.parse(node.name, true);		// What is titleParser?
			if ( Title === "" )
				Title = window.location.host;
			else
				Title += " | " + window.location.host;
		}
		else {
			Title = window.location.host;
		}
		return Title;
	}

	getContent( {node, user, path, extra, featured} ) {
		var EditMode = extra && extra.length && extra[extra.length-1] == 'edit';
		const GamesFeedFilter = this.state.gamesFilter;

		if ( node.type === 'post' ) {
			return <ViewContentPost node={node} user={user} path={path} extra={extra} edit={EditMode} />;

//			var Content = [];
//			Content.push(<ContentPost node={node} user={user} path={path} extra={extra} authored by love />);
//
//			if ( !EditMode ) {
//				Content.push(<ContentComments node={node} user={user} path={path} extra={extra} />);
//			}
//
//			return (
//				<div id="content">
//					{Content}
//				</div>
//			);
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
//		else if ( node.type === 'tags' ) {
//			return (
//				<div id="content">
//					<Common node={node} user={user} >
//						<CommonBody>Placeholder for <strong>Tags</strong> page</CommonBody>
//					</Common>
//				</div>
//			);
//		}
		else if ( node.type === 'tag' ) {
			var Methods = ['target'];
			console.log("filter:", GamesFeedFilter);
			return (
				<div id="content">
					<Common node={node} user={user} >
						<CommonBody><h2>Tag: {node.name}</h2></CommonBody>
					</Common>
					<ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} filter={GamesFeedFilter} />
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
						View.push(<ContentGames node={node} user={user} path={path} extra={extra} methods={['authors']} subsubtypes={SubSubType ? SubSubType : ""} filter={GamesFeedFilter} />);
					}
					else if ( ViewType == 'article' ) {

					}
					else if ( ViewType == 'following') {
						View.push(<ContentNavUser node={node} user={user} path={path} extra={extra} featured={featured} />);
						View.push(<ContentUserFollowing node={node} user={user} path={path} extra={extra} featured={featured} />);
					}
					else if ( ViewType == 'followers') {
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
			var ShowPage = null;
			var ShowFilters = null;

			if ( extra && extra.length && extra[0] == 'theme' ) {
				let NewPath = path+'/'+extra[0];
				let NewExtra = extra.slice(1);
				ShowNav = <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
				ShowPage = <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
			}
			else if ( extra && extra.length && extra[0] == 'games' || extra[0] == 'results' ) {
				let DefaultSubFilter = 'all';
				let DefaultFilter = 'smart';

				// Results
				if ( node && node.meta && node.meta['theme-mode'] >= 8 ) {
					DefaultSubFilter = 'jam';//'all';
					DefaultFilter = 'overall';
				}

				function EvalFilter2(str) {
					let MappingTable = {
						'all': 'compo+jam',
						'classic': 'cool',

						'overall': 'grade-01-result',
						'fun': 'grade-02-result',
						'innovation': 'grade-03-result',
						'theme': 'grade-04-result',
						'graphics': 'grade-05-result',
						'audio': 'grade-06-result',
						'humor': 'grade-07-result',
						'mood': 'grade-08-result',
					};

					if ( MappingTable[str] )
						return MappingTable[str];
					return str;
				}

				let Methods = [];
				let Filter = DefaultFilter;
				let SubFilter = DefaultSubFilter;

				if ( extra.length > 2 )
					SubFilter = extra[2];
				if ( extra.length > 1 )
					Filter = extra[1];

				// Determine Filter
				if ( Filter.indexOf('-') == -1 ) {		// should be '+'
					switch ( Filter ) {
						case 'smart':
						case 'classic':
						case 'cool':
						case 'danger':
						case 'grade':
						case 'feedback':
							Methods = [EvalFilter2(Filter)];
							break;

						case 'overall':
						case 'fun':
						case 'innovation':
						case 'theme':
						case 'graphics':
						case 'audio':
						case 'humor':
						case 'mood':
							Methods = [EvalFilter2(Filter), 'reverse'];
							break;

						case 'zero':
							Methods = ['grade', 'reverse'];
							break;

						case 'jam':
						case 'compo':
						case 'craft':
						case 'late':
						case 'release':
						case 'unfinished':
							SubFilter = Filter;
							Methods = [EvalFilter2(DefaultFilter)];
							break;

						default:
							Methods = ['null'];
							break;
					}
				}
				else {
					// If '+' was found, assume it's a multi-part subfilter and not a filter
					SubFilter = Filter.split('-');		// should be '+'
					Methods = [EvalFilter2(DefaultFilter)];
				}

				if ( node && node.meta && node.meta['theme-mode'] < 8 ) {
					ShowFilters = <GamesFilter
							Filter={Filter}
							SubFilter={SubFilter}
							Path={`${this.props.path}/${extra[0]}/`}
							node={node}
							onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
							showEvent={true}
							showRatingSort={true}
							showRatingSortDesc={true}
						/>;
				}
				else {	// results
					ShowFilters = <GamesFilter
							Filter={Filter}
							SubFilter={SubFilter}
							Path={`${this.props.path}/${extra[0]}/`}
							node={node}
							onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
							showEvent={true}
							showVotingCategory={true}
						/>;
				}

				SubFilter = EvalFilter2(SubFilter);

				// Require games to be part of the content node passed
				Methods.push('parent');
				//Methods.push('superparent');	// Why doesn't this work? It's unnecssary, but it should still work

				ShowPage = <ContentGames node={node} user={user} path={path} extra={extra} noevent methods={Methods} subsubtypes={SubFilter ? SubFilter : null} filter={GamesFeedFilter} />;

//				let SubSubType = 'compo+jam';	// alphabetical
//				if ( extra && extra.length > 1 ) {
//					if ( extra[1] != 'all' )
//						SubSubType = extra[1];
//				}
//
//				ShowPage = <ContentGames node={node} user={user} path={path} extra={extra} noevent methods={['parent','smart']} subsubtypes={SubSubType ? SubSubType : null} />;
			}
			else {
				//ShowNav = <ContentNavEvent node={node} user={user} path={path} extra={extra} />;
				ShowPage = <ContentStatsEvent node={node} />;
			}

			return (
				<div id="content">
					<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} />
					{ShowNav}
					{ShowFilters}
					{ShowPage}
				</div>
			);
		}
		else if ( node.type === 'events' || node.type === 'group' || node.type === 'tags' ) {
			return <div id="content"><ContentGroup node={node} user={user} path={path} extra={extra} /></div>;
		}
		else if ( node.type === 'root' ) {
			var ShowNavRoot = <ContentNavRoot node={node} user={user} path={path} extra={extra} />;

			let Viewing = '/'+ (extra ? extra.join('/') : '');
			if ( Viewing == '/' ) {
				Viewing = '/feed';
				if ( user && user.id ) {
					Viewing = '/home';		// Don't delete me
				}
			}

			if ( Viewing == '/feed' ) {
				return (
					<ContentTimeline types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra}>
						{ShowNavRoot}
						<ContentTimeline types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
					</ContentTimeline>
				);
			}
			else if ( Viewing == '/home' ) {
				var ShowHome = null;
				// TODO: switch modes

				// If my entry is Published
//				if ( featured && featured.what && featured.what.length && featured.what[0] && featured.what_node && featured.what_node[featured.what[0]] && featured.what_node[featured.what[0]].published ) {
//					ShowHome = (
//						<Common node={node} user={user}>
//							<CommonBody>You can start playing and rating games <NavLink href={featured.path+'/games'}>here</NavLink>.</CommonBody>
//						</Common>
//					);
//				}

				return (
					<ContentTimeline types={['post']} methods={['all']} node={node} user={user} path={path} extra={extra}>
						{ShowNavRoot}
						{ShowHome}
						<ContentTimeline types={['post']} subtypes={['news']} methods={['all']} minimized nomore noemptymessage limit={1} node={node} user={user} path={path} extra={extra} />
					</ContentTimeline>
				);
			}
			else if ( Viewing == '/news' ) {
				return <ContentTimeline types={['post']} subtypes={['news']} methods={['all']} node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
			else if ( Viewing == '/hot' ) {
				return <ContentTimeline node={node} user={user} path={path} extra={extra}>{ShowNavRoot}</ContentTimeline>;
			}
//			else if ( Viewing == '/games' ) {
			else if ( extra && extra.length && extra[0] == 'games' ) {
				let DefaultSubSubFilter = 'featured';
				let DefaultSubFilter = 'all';
				let DefaultFilter = 'danger';//'smart';

				function EvalFilter(str) {
					let MappingTable = {
						'all': 'compo+jam+craft+release',
						'classic': 'cool',
					};

					if ( MappingTable[str] )
						return MappingTable[str];
					return str;
				}

				let Methods = [];
				let Filter = DefaultFilter;
				let SubFilter = DefaultSubFilter;
				let SubSubFilter = DefaultSubSubFilter;

				if ( extra.length > 3 )
					SubSubFilter = extra[3];
				if ( extra.length > 2 )
					SubFilter = extra[2];
				if ( extra.length > 1 )
					Filter = extra[1];

				// Determine Filter
				if ( Filter.indexOf('-') == -1 ) {		// should be '+'
					switch ( Filter ) {
						case 'smart':
						case 'classic':
						case 'cool':
						case 'danger':
						case 'grade':
						case 'feedback':
							Methods = [EvalFilter(Filter)];
							break;

						case 'zero':
							Methods = ['grade', 'reverse'];
							break;

						case 'jam':
						case 'compo':
						case 'craft':
						case 'late':
						case 'release':
						case 'unfinished':
							SubFilter = Filter;
							Methods = [EvalFilter(DefaultFilter)];
							break;

						default:
							Methods = ['null'];
							break;
					}
				}
				else {
					// If '+' was found, assume it's a multi-part subfilter and not a filter
					SubFilter = Filter.split('-');		// should be '+'
					Methods = [EvalFilter(DefaultFilter)];
				}

				let ShowFilters = null;
				if ( true ) {
					ShowFilters = <GamesFilter
						Filter={Filter}
						SubFilter={SubFilter}
						SubSubFilter={SubSubFilter}
						Path={`${this.props.path}/games/`}
						node={node}
						onchangefilter={(filter)=>{this.setState({'gamesFilter': filter});}}
						showFeatured={true}
						showEvent={true}
						showRatingSort={true}
						showRatingSort={true}
					/>;
				}

				let NodeArg = node;
				if ( SubSubFilter == 'featured' ) {
					Methods.push('parent');
					NodeArg = featured;
				}

				SubFilter = EvalFilter(SubFilter);

				var ShowHeader = null;
				if ( NodeArg ) {
					return (
						<div id="content">
							{ShowNavRoot}
							{ShowFilters}
							<ContentGames node={NodeArg} user={user} path={path} extra={extra} methods={Methods} subsubtypes={SubFilter ? SubFilter : null} filter={GamesFeedFilter}/>
						</div>
					);
				}
			}
			else if ( Viewing == '/palette' ) {
				return <div id="content"><ContentPalette node={node} user={user} path={path} extra={extra} /></div>;
			}
			else {
				return <div id="content"><ContentError user={user} path={path} extra={extra}>{Viewing} not found .</ContentError></div>;
			}
		}
		else {
			return <div id="content"><div class="content-base">Unsupported Node Type: {""+node.type}</div></div>;
		}
	}

	render( props ) {
		if ( props.node ) {
			document.title = this.getTitle(props);
			return this.getContent(props);
		}
		else {
			return <div id="content">{this.props.children}</div>;
		}
	}
}
