import {h, Component} 				from 'preact/preact';
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
		var featured = this.props.featured;

		window.location.hash = "#create/"+featured.id+"/item/game";
	}

	render( props, state ) {
		let {node, user, path, extra, featured} = props;
		props = Object.assign({}, props);

		if ( node ) {
			props.header = "EVENT";
			props.headerIcon = "trophy";
			props.headerClass = "-col-ab";
//			props.titleIcon = "trophy";
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

		var ShowGame = null;
		if ( true ) {
			let Class = null;
			if ( extra && extra.length > 0 && extra[0] == "games") {
				Class = "-selected";
			}

			ShowGame = <ContentCommonNavButton href={path+'/games'} class={Class}><SVGIcon>gamepad</SVGIcon><div class="if-sidebar-inline">Games</div></ContentCommonNavButton>;
		}

		let ShowMyGrades = null;
		//TODO: How to know if we're grading or have graded?
		if ( true ) {
			if ( extra && extra.length > 0 && extra[0] == "mygrades") {
				Class = "-selected";
			}

			ShowMyGrades = <ContentCommonNavButton href={path+'/mygrades'} class={Class}><SVGIcon>star-half</SVGIcon><div class="if-sidebar-inline">My Grades</div></ContentCommonNavButton>;
		}

//		if ( extra && extra.length ) {
//			Class = "-disabled";
//		}
        var ShowJoin = null;
        if ( user && user.id && node_CanCreate(node) ) {
            var Class = "-diabled";
            if ( extra && extra.length > 0 && extra[0] == "games") {
                Class = "-selected";
            }

			// NOTE: THIS IS WRONG! We should be asking the event node (i.e. this) for `what`. Alas, with 1 event we can cheat
			if ( featured && featured.what && featured.what.length ) {
				var FeaturedGame = featured.what[featured.what.length-1]; // Hack
//				ShowGame =

			}
			else {
				ShowJoin = (
					<ContentCommonNavButton onclick={this.onJoin} class={Class}>
						<SVGIcon>publish</SVGIcon><div class="if-sidebar-inline">Join Event</div>
					</ContentCommonNavButton>
				);
			}
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
		if ( node_CanTheme(node) ) {
			let Class = null;
			if ( extra && extra.length ) {
				if ( extra[0] === 'theme' ) {
					Class = "-selected";
				}
			}

			ShowTheme = <ContentCommonNavButton href={path+'/theme'} class={Class}><SVGIcon>ticket</SVGIcon><div class="if-sidebar-inline">Theme Selection</div></ContentCommonNavButton>;
		}

//		if ( !IsHome )
//			props.nomarkup = true;

		props.class = 'content-event';
		props.above = [];

		if ( node.meta['event-start'] && node.meta['event-end'] ) {
			let Start = new Date(node.meta['event-start']);
			let End = new Date(node.meta['event-end']);

			let LanguagePrefix = "["+navigator.language+"] ";
			if ( navigator.languages ) {
				LanguagePrefix += "["+navigator.languages.join(',')+"] ";
			}

			ShowEventTheme = null;
			if ( node.meta['event-theme'] ) {
				ShowEventTheme = <div><SVGIcon small baseline gap>lightbulb</SVGIcon> Theme: <strong>{node.meta['event-theme']}</strong></div>;
			}

			props.above.push(
				<ContentCommonBody>
					{ShowEventTheme}
					<div><SVGIcon small baseline gap>calendar</SVGIcon> {getLocaleDay(Start)} {getLocaleMonthDay(Start)} to <span class="if-sidebar-inline">{getLocaleDay(End)}</span> {getLocaleDate(End)}</div>
					<div title={LanguagePrefix+Start.toString()}><SVGIcon small baseline gap>clock</SVGIcon> Starts at <strong>{getLocaleTime(Start)}</strong> {getLocaleTimeZone(Start)} <NavLink href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></NavLink></div>
				</ContentCommonBody>
			);
		}

		//props.minmax = true;
		if ( !IsHome )
			props.minimized = true;

		return (
			<ContentSimple {...props}>
				<ContentCommonNav>
                    {ShowJoin}
				</ContentCommonNav>
			</ContentSimple>
		);
	}

//					{ShowHome}
//					{ShowGame}
//					{ShowMyGrades}
//					{ShowFeed}
//					{ShowTheme}

}
