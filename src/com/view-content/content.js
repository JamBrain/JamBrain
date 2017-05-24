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
import ContentStatsEvent				from 'com/content-stats/stats-event';

import ContentPalette					from 'com/content-palette/palette';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';
import CommonNav						from 'com/content-common/common-nav';
import CommonNavButton					from 'com/content-common/common-nav-button';

import HeadMan 							from '../../internal/headman/headman';
import marked 							from '../../internal/marked/marked';

export default class ViewContent extends Component {
  constructor(props) {
    super(props);
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.node) {
			this.generateMeta(nextProps.node);
		}
	}

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
/*
						let DefaultSubFilter = 'all';
						let DefaultFilter = 'smart';

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


						let FilterDesc = {
							'smart': <div><strong>Smart</strong>: This is the modern balacing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</div>,
							'unbound': <div><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</div>,
							'classic': <div><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</div>,
							'danger': <div><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</div>, //'
							'feedback': <div><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</div>,
							'grade': <div><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</div>,
						};

						let ShowFilters = null;
						if ( true ) {
							let Path = this.props.path+'/games/';

							ShowFilters = (
								<Common node={this.props.node} class="filter-item filter-game">
									<CommonNav>
										<CommonNavButton href={Path+Filter+'/all'} class={SubFilter == 'all' ? '-selected' : ''}><SVGIcon>gamepad</SVGIcon><div>All</div></CommonNavButton>
										<CommonNavButton href={Path+Filter+'/jam'} class={SubFilter == 'jam' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Jam</div></CommonNavButton>
										<CommonNavButton href={Path+Filter+'/compo'} class={SubFilter == 'compo' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Compo</div></CommonNavButton>
										<CommonNavButton href={Path+Filter+'/unfinished'} class={SubFilter == 'unfinished' ? '-selected' : ''}><SVGIcon>trash</SVGIcon><div>Unfinished</div></CommonNavButton>
									</CommonNav>
									<CommonNav>
										<CommonNavButton href={Path+'smart/'+SubFilter} class={Filter == 'smart' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Smart</div></CommonNavButton>
										<CommonNavButton href={Path+'classic/'+SubFilter} class={Filter == 'classic' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Classic</div></CommonNavButton>
										<CommonNavButton href={Path+'danger/'+SubFilter} class={Filter == 'danger' ? '-selected' : ''}><SVGIcon>help</SVGIcon><div>Danger</div></CommonNavButton>
										<CommonNavButton href={Path+'feedback/'+SubFilter} class={Filter == 'feedback' ? '-selected' : ''}><SVGIcon>bubbles</SVGIcon><div>Feedback</div></CommonNavButton>
										<CommonNavButton href={Path+'grade/'+SubFilter} class={Filter == 'grade' ? '-selected' : ''}><SVGIcon>todo</SVGIcon><div>Grade</div></CommonNavButton>
									</CommonNav>
									<CommonBody>{FilterDesc[Filter]}</CommonBody>
								</Common>
							);
						}

						SubFilter = EvalFilter(SubFilter);
						Methods.push('authors');

						View.push(ShowNavRoot);
						View.push(ShowFilters);
						View.push(<ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} subsubtypes={SubFilter ? SubFilter : null} />);
*/

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
			var ShowPage = null;
			var ShowFilters = null;

			if ( extra && extra.length && extra[0] == 'theme' ) {
				let NewPath = path+'/'+extra[0];
				let NewExtra = extra.slice(1);
				ShowNav = <ContentNavTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
				ShowPage = <ContentEventTheme node={node} user={user} path={NewPath} extra={NewExtra} featured={featured} />;
			}
			else if( extra && extra.length && extra[0] == 'games' ){
				let DefaultSubFilter = 'jam';//'all';
				let DefaultFilter = 'overall';
				
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
							Methods = [EvalFilter2(Filter),'reverse'];
							break;
						
						case 'zero':
							Methods = ['grade','reverse'];
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

/*
				let FilterDesc = {
					'smart': <div><strong>Smart</strong>: This is the modern balacing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</div>,
					'unbound': <div><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</div>,
					'classic': <div><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</div>,
					'danger': <div><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</div>, //'
					'zero': <div><strong>Zero</strong>: This filter shows the most neglected games. These are often new users that didn't understand you should rate games. Leaving them some feedback is greatly appreciated.</div>, //'
					'feedback': <div><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</div>,
					'grade': <div><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</div>,
				};
*/

				if ( true ) {
					let Path = this.props.path+'/games/';
					
					ShowFilters = (
						<Common node={this.props.node} class="filter-item filter-game">
							<CommonNav>
								<CommonNavButton href={Path+Filter+'/jam'} class={SubFilter == 'jam' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Jam</div></CommonNavButton>
								<CommonNavButton href={Path+Filter+'/compo'} class={SubFilter == 'compo' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Compo</div></CommonNavButton>
								<CommonNavButton href={Path+Filter+'/all'} class={SubFilter == 'all' ? '-selected' : ''}><SVGIcon>earth</SVGIcon><div>All</div></CommonNavButton>
							</CommonNav>
							<CommonNav>
								<CommonNavButton href={Path+'overall/'+SubFilter} class={'-no-icon '+(Filter == 'overall' ? '-selected' : '')}><div>Overall</div></CommonNavButton>
								<CommonNavButton href={Path+'fun/'+SubFilter} class={'-no-icon '+(Filter == 'fun' ? '-selected' : '')}><div>Fun</div></CommonNavButton>
								<CommonNavButton href={Path+'innovation/'+SubFilter} class={'-no-icon '+(Filter == 'innovation' ? '-selected' : '')}><div>Innovation</div></CommonNavButton>
								<CommonNavButton href={Path+'theme/'+SubFilter} class={'-no-icon '+(Filter == 'theme' ? '-selected' : '')}><div>Theme</div></CommonNavButton>
								<CommonNavButton href={Path+'graphics/'+SubFilter} class={'-no-icon '+(Filter == 'graphics' ? '-selected' : '')}><div>Graphics</div></CommonNavButton>
								<CommonNavButton href={Path+'audio/'+SubFilter} class={'-no-icon '+(Filter == 'audio' ? '-selected' : '')}><div>Audio</div></CommonNavButton>
								<CommonNavButton href={Path+'humor/'+SubFilter} class={'-no-icon '+(Filter == 'humor' ? '-selected' : '')}><div>Humor</div></CommonNavButton>
								<CommonNavButton href={Path+'mood/'+SubFilter} class={'-no-icon '+(Filter == 'mood' ? '-selected' : '')}><div>Mood</div></CommonNavButton>
							</CommonNav>
						</Common>
					);
				}
//							<CommonBody>{FilterDesc[Filter]}</CommonBody>

//								<CommonNavButton href={Path+'smart/'+SubFilter} class={Filter == 'smart' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Smart</div></CommonNavButton>
//								<CommonNavButton href={Path+'classic/'+SubFilter} class={Filter == 'classic' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Classic</div></CommonNavButton>
//								<CommonNavButton href={Path+'danger/'+SubFilter} class={Filter == 'danger' ? '-selected' : ''}><SVGIcon>help</SVGIcon><div>Danger</div></CommonNavButton>
//								<CommonNavButton href={Path+'zero/'+SubFilter} class={Filter == 'zero' ? '-selected' : ''}><SVGIcon>gift</SVGIcon><div>Zero</div></CommonNavButton>
//								<CommonNavButton href={Path+'feedback/'+SubFilter} class={Filter == 'feedback' ? '-selected' : ''}><SVGIcon>bubbles</SVGIcon><div>Feedback</div></CommonNavButton>
//								<CommonNavButton href={Path+'grade/'+SubFilter} class={Filter == 'grade' ? '-selected' : ''}><SVGIcon>todo</SVGIcon><div>Grade</div></CommonNavButton>
				
				SubFilter = EvalFilter2(SubFilter);
				
				ShowPage = <ContentGames node={node} user={user} path={path} extra={extra} noevent methods={Methods} subsubtypes={SubFilter ? SubFilter : null} />;

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
		else if ( node.type === 'events' || node.type === 'group' ) {
			return <div id="content"><ContentGroup node={node} user={user} path={path} extra={extra} /></div>;
		}
		else if ( node.type === 'root' ) {
			var ShowNavRoot = <ContentNavRoot node={node} user={user} path={path} extra={extra} />;

			let Viewing = '/'+ (extra ? extra.join('/') : '');
			if ( Viewing == '/' ) {
				Viewing = '/feed';
				if ( user && user.id ) {
					Viewing = '/feed';		// Don't delete me
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
				let DefaultFilter = 'grade';//'danger';//'smart';
				
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
							Methods = ['grade','reverse'];
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


				let FilterDesc = {
					'smart': <div><strong>Smart</strong>: This is the modern balacing filter. It balances the list using a combination of votes and the karma given to feedback. You start seeing diminishing returns after 50 ratings, but you can make up for it by leaving quality feedback.</div>,
					'unbound': <div><strong>Unbound</strong>: This is a variation of the Smart filter that is unbound. For curiousity.</div>,
					'classic': <div><strong>Classic</strong>: This is the classic balancing filter. It balances the list based on ratings alone. You start seeing diminishing returns after 100 ratings.</div>,
					'danger': <div><strong>Danger</strong>: This is the rescue filter. Everything with less than 20 ratings sorted top to bottom. Items on the first page are typically 1-2 rating away, so help them out!</div>, //'
					'zero': <div><strong>Zero</strong>: This filter shows the most neglected games. These are often new users that didn't understand you should rate games. Leaving them some feedback is greatly appreciated.</div>, //'
					'feedback': <div><strong>Feedback</strong>: This filter lets you find who is working the hardest, leaving quality feedback for others.</div>,
					'grade': <div><strong>Grade</strong>: This filter lets you find the games that have the most ratings.</div>,
				};

				let ShowFilters = null;
				if ( true ) {
					let Path = this.props.path+'/games/';

					ShowFilters = (
						<Common node={this.props.node} class="filter-item filter-game">
							<CommonNav>
								<CommonNavButton href={Path+Filter+'/all'} class={SubFilter == 'all' ? '-selected' : ''}><SVGIcon>gamepad</SVGIcon><div>All</div></CommonNavButton>
								<CommonNavButton href={Path+Filter+'/jam'} class={SubFilter == 'jam' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Jam</div></CommonNavButton>
								<CommonNavButton href={Path+Filter+'/compo'} class={SubFilter == 'compo' ? '-selected' : ''}><SVGIcon>trophy</SVGIcon><div>Compo</div></CommonNavButton>
								<CommonNavButton href={Path+Filter+'/unfinished'} class={SubFilter == 'unfinished' ? '-selected' : ''}><SVGIcon>trash</SVGIcon><div>Unfinished</div></CommonNavButton>
							</CommonNav>
							<CommonNav>
								<CommonNavButton href={Path+'smart/'+SubFilter} class={Filter == 'smart' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Smart</div></CommonNavButton>
								<CommonNavButton href={Path+'classic/'+SubFilter} class={Filter == 'classic' ? '-selected' : ''}><SVGIcon>ticket</SVGIcon><div>Classic</div></CommonNavButton>
								<CommonNavButton href={Path+'danger/'+SubFilter} class={Filter == 'danger' ? '-selected' : ''}><SVGIcon>help</SVGIcon><div>Danger</div></CommonNavButton>
								<CommonNavButton href={Path+'zero/'+SubFilter} class={Filter == 'zero' ? '-selected' : ''}><SVGIcon>gift</SVGIcon><div>Zero</div></CommonNavButton>
								<CommonNavButton href={Path+'feedback/'+SubFilter} class={Filter == 'feedback' ? '-selected' : ''}><SVGIcon>bubbles</SVGIcon><div>Feedback</div></CommonNavButton>
								<CommonNavButton href={Path+'grade/'+SubFilter} class={Filter == 'grade' ? '-selected' : ''}><SVGIcon>todo</SVGIcon><div>Grade</div></CommonNavButton>
							</CommonNav>
							<CommonBody>{FilterDesc[Filter]}</CommonBody>
						</Common>
					);
				}

				SubFilter = EvalFilter(SubFilter);

				return (
					<div id="content">
						{ShowNavRoot}
						{ShowFilters}
						<ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} subsubtypes={SubFilter ? SubFilter : null} />
					</div>
				);
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
