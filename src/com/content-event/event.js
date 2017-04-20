import { h, Component } 				from 'preact/preact';
import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentEventHome					from 'com/content-event/event-home';
import ContentEventIdea					from 'com/content-event/event-idea';
import ContentEventSlaughter			from 'com/content-event/event-slaughter';
import ContentEventFusion				from 'com/content-event/event-fusion';
import ContentEventList					from 'com/content-event/event-list';
//import ContentEventFinal				from 'com/content-event/event-final';
//import ContentEventJudging				from 'com/content-event/event-judging';
//import ContentEventResults				from 'com/content-event/event-results';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonNav					from 'com/content-common/common-nav';
import ContentCommonNavButton			from 'com/content-common/common-nav-button';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';


import ContentSimple					from 'com/content-simple/simple';


export default class ContentEvent extends Component {
	constructor( props ) {
		super(props);
//
//		this.state = {
//			'editing': this.isEditMode(),
//			'modified': false,
//
//			'body': props.node.body,
//		};
		this.onJoin = this.onJoin.bind(this);
	}

//	componentDidMount() {
//	}
//	componentWillUnmount() {
//	}

//	isEditMode() {
//		var extra = this.props.extra;
//		return extra && extra.length && extra[extra.length-1] == 'edit';
//	}

	onJoin( e ) {
		console.log('join');
	}

	render( props, state ) {
		props = Object.assign({}, props);

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		if ( node ) {
			props.header = "EVENT";
			props.headerClass = "-col-ab";
			props.titleIcon = "trophy";
		}

		var ShowHome = null;
		var IsHome = false;
		if ( true ) {
			let Class = null;
			if ( extra && extra.length == 0 ) {
				Class = "-selected";
				IsHome = true;
			}

			ShowHome = <ContentCommonNavButton href={path} class={Class}><SVGIcon>home</SVGIcon><div class="if-sidebar-inline">Home</div></ContentCommonNavButton>;
		}

        var ShowJoin = null;
        if ( true ) {
            let Class = "-disabled";
            //if ( extra && extra.length > 0 && extra[0] == "join") {
            //    Class = "-disabled";
            //}

            ShowJoin = <ContentCommonNavButton onclick={this.onJoin} class={Class}><SVGIcon>publish</SVGIcon><div class="if-sidebar-inline">Join Event</div></ContentCommonNavButton>;
        }

		var ShowGame = null;
		if ( true ) {
			let Class = null;
			if ( extra && extra.length > 0 && extra[0] == "games") {
				Class = "-selected";
			}

			ShowGame = <ContentCommonNavButton href={path+'/games'} class={Class}><SVGIcon>gamepad</SVGIcon><div class="if-sidebar-inline">View Games</div></ContentCommonNavButton>;
		}

		var ShowFeed = null;
//		if ( true ) {
//			let Class = null;
//			if ( extra && extra.length ) {
//				if ( extra[0] === 'feed' || extra[0] === 'hot' || extra[0] === 'news' || extra[0] === 'games' ) {
//					Class = "-selected";
//				}
//			}
//			// Root node, context sensitive
//			else {
//				// If not logged in
//				if ( user && user.id === 0 ) {
//					Class = "-selected";
//				}
//			}
//
//			ShowFeed = <ContentCommonNavButton href={path} class={Class}><SVGIcon>feed</SVGIcon>Feed</ContentCommonNavButton>;
//		}

		var ShowTheme = null;
		if ( true ) {
			let Class = null;
			if ( extra && extra.length ) {
				if ( extra[0] === 'theme' ) {
					Class = "-selected";
				}
			}

			ShowTheme = <ContentCommonNavButton href={path+'/theme'} class={Class}><SVGIcon>ticket</SVGIcon><div class="if-sidebar-inline">Theme Selection</div></ContentCommonNavButton>;
		}

		if ( !IsHome )
			props.nomarkup = true;

		props.class = 'content-event';
		props.above = [];

		if ( node.meta['event-start'] && node.meta['event-end'] ) {
			let Start = new Date(node.meta['event-start']);
			let End = new Date(node.meta['event-end']);

			let LanguagePrefix = "["+navigator.language+"] ";
			if ( navigator.languages ) {
				LanguagePrefix += "["+navigator.languages.join(',')+"] ";
			}

			props.above.push(
				<ContentCommonBody>
					<div><SVGIcon small baseline gap>calendar</SVGIcon> {getLocaleDay(Start)} {getLocaleMonthDay(Start)} to <span class="if-sidebar-inline">{getLocaleDay(End)}</span> {getLocaleDate(End)}</div>
					<div title={LanguagePrefix+Start.toString()}><SVGIcon small baseline gap>clock</SVGIcon> Starts at <strong>{getLocaleTime(Start)}</strong> {getLocaleTimeZone(Start)} <NavLink href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></NavLink></div>
				</ContentCommonBody>
			);
		}

		return (
			<ContentSimple {...props}>
				<ContentCommonNav>
					{ShowHome}
                    {ShowJoin}
					{ShowGame}
					{ShowFeed}
					{ShowTheme}
				</ContentCommonNav>
			</ContentSimple>
		);

//		props = Object.assign({}, props);	// Shallow copy we can change props
//
//		var node = props.node;
//		var user = props.user;
//		var path = props.path;
//		var extra = props.extra;
//		var error = state.error;
//
//		if ( node.slug ) {
//			return (
//				<ContentCommon {...props}>
//					<ContentCommonBodyTitle href={path} title={node.name} />
//					<ContentCommonBodyMarkup
//						node={node}
//						editing={state.editing}
//						placeholder="Say something"
//						class="-block-if-not-minimized"
//						onmodify={this.onModifyText}
//					>
//						{state.body}
//					</ContentCommonBodyMarkup>
//					<ContentCommonNav>
//					</ContentCommonNav>
//					{props.children}
//				</ContentCommon>
//			);
//
////					<ContentCommonBodyAvatar src={node.meta.avatar ? node.meta.avatar : ''} />
////						{Nav}
//		}
//		else {
//			return <ContentLoading />;
//		}

/*
		if ( node.slug ) {
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };

			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;

			var EventBody = null;

			// Internal URLs
			if ( extra.length ) {
				// Theme Selection URL (/theme/)
				if ( extra[0] === 'theme' ) {
					var _path = path + '/' + extra[0];
					var _extra = extra.slice(1);

					switch (ThemeMode) {
						case 1:
							EventBody = <ContentEventIdea node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 2:
							EventBody = <ContentEventSlaughter node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 3:
							EventBody = <ContentEventFusion node={node} user={user} path={_path} extra={_extra} />;
							break;
						case 4:
							EventBody = <ContentEventList node={node} user={user} path={_path} extra={_extra} />;
							break;
//						case 5:
//							EventBody = <ContentEventFinal node={node} user={user} path={_path} extra={_extra} />;
//							break;
						default:
							EventBody = (
								<div>
									<h3>Theme Selection: Closed</h3>
									<div>{"This event is either old, has no Theme Selection, or it hasn't started yet"}</div>
								</div>
							);
							break;
					};
				}
				else {
					// TODO: emit 404
					EventBody = (
						<div>
							<h3>404</h3>
						</div>
					);
				}
			}
			else {
				EventBody = (<ContentEventHome node={node} user={user} path={path} extra={extra} />);
			}

			var EventWhen = null;
			var EventWhere = null;
			if ( node.meta['when'] ) {
				EventWhen = <div class="-detail -when"><SVGIcon baseline small>clock</SVGIcon> <span>{node.meta['when']}</span></div>;
			}
			if ( node.meta['where'] ) {
				EventWhere = <div class="-detail -where"><SVGIcon baseline small>location</SVGIcon> <span>{node.meta['where']}</span></div>;
			}

			return (
				<div class="content-base content-user-legacy content-event">
					<div class="-header">
						<div class="-title _font2"><SVGIcon baseline small>trophy</SVGIcon> <NavLink href={path} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						{EventWhen}
						{EventWhere}
					</div>
					{EventBody}
					<div class="-footer">
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : <NavSpinner /> }
				</div>
			);
		}
*/

	}
}
