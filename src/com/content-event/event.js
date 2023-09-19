import {Component} from 'preact';
import './event.less';

import {Link, Icon, Button} from 'com/ui';
import { getLocaleDay, getLocaleMonthDay, getLocaleDate, getLocaleTime, getLocaleTimeZone } from 'internal/time';
import { node_CanCreate, nodeEvent_CanTheme } from 'internal/lib';

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
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';

import ContentSimple					from 'com/content-simple/simple';

import $Node							from 'backend/js/node/node';



export default class ContentEvent extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'what': null
		};
//
//		this.state = {
//			'editing': this.isEditMode(),
//			'modified': false,
//
//			'body': props.node.body,
//		};
		this.onJoin = this.onJoin.bind(this);
	}

	componentDidMount() {
		$Node.What(this.props.node.id).then(r => {
			//console.log("arr", r);

			// HACK: Gets the first game I'm an author of
			if ( r.node && Object.keys(r.node).length ) {
				let newState = {};

				newState.what = r.node[Object.keys(r.node)[0]];

				this.setState(newState);
			}
		});
	}
//	componentWillUnmount() {
//	}

//	isEditMode() {
//		var extra = this.props.extra;
//		return extra && extra.length && extra[extra.length-1] == 'edit';
//	}

	onJoin( e ) {
		//var featured = this.props.featured;

		window.location.hash = "#create/"+this.props.node.id+"/item/game";
	}

	render( props, state ) {
		let {node, user, path, extra, featured} = props;
		props = Object.assign({}, props);

		if ( node ) {
			props.flag = "EVENT";
			props.flagIcon = "trophy";
			props.flagClass = "-col-ab";
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

			ShowHome = <Button href={path} class={Class}><Icon src="home" /><div class="if-sidebar-inline">Home</div></Button>;
		}

		var ShowGame = null;
		if ( true ) {
			let Class = null;
			if ( extra && extra.length > 0 && extra[0] == "games") {
				Class = "-selected";
			}

			ShowGame = <Button href={path+'/games'} class={Class}><Icon src="gamepad" /><div class="if-sidebar-inline">Games</div></Button>;
		}

		let ShowMyGrades = null;
		//TODO: How to know if we're grading or have graded?
		if ( true ) {
			if ( extra && extra.length > 0 && extra[0] == "mygrades") {
				Class = "-selected";
			}

			ShowMyGrades = <Button href={path+'/mygrades'} class={Class}><Icon src="star-half" /><div class="if-sidebar-inline">My Grades</div></Button>;
		}

//		if ( extra && extra.length ) {
//			Class = "-disabled";
//		}
        var ShowJoin = null;
        if ( user && user.id && node_CanCreate(node, "item/game") ) {
            var Class = "-diabled";
            if ( extra && extra.length > 0 && extra[0] == "games") {
                Class = "-selected";
            }

			//console.log("state", state);

			// NOTE: THIS IS WRONG! We should be asking the event node (i.e. this) for `what`. Alas, with 1 event we can cheat
			//if ( featured && featured.what && featured.focus_id ) {
			if ( state && state.what && state.what.id ) {
//				var FeaturedGame = featured.what[featured.focus_id]; // Hack
				ShowJoin = (
					<Button href={path + '/' + state.what.slug} class={Class}>
						<Icon src="gamepad" /><div class="if-sidebar-inline">My Game</div>
					</Button>
				);
			}
			else {
				ShowJoin = (
					<Button onClick={this.onJoin} class={Class}>
						<Icon src="publish" /><div class="if-sidebar-inline">Join Event</div>
					</Button>
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
//			ShowFeed = <Button href={path} class={Class}><Icon src="feed" />Feed</Button>;
//		}

		var ShowTheme = null;
		if ( nodeEvent_CanTheme(node) ) {
			let Class = null;
			if ( extra && extra.length ) {
				if ( extra[0] === 'theme' ) {
					Class = "-selected";
				}
			}

			ShowTheme = <Button href={path+'/theme'} class={Class}><Icon src="ticket" /><div class="if-sidebar-inline">Theme Selection</div></Button>;
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

			let ShowEventTheme = null;
			if ( node.meta['event-theme'] ) {
				ShowEventTheme = <><Icon class="-small -baseline -gap" src="lightbulb" /> Theme: <strong>{node.meta['event-theme']}</strong></>;
			}

			props.above.push(
				<ContentCommonBody>
					{ShowEventTheme}
					<div><Icon class="-small -baseline -gap" src="calendar" /> {getLocaleDay(Start)} {getLocaleMonthDay(Start)} to <span class="if-sidebar-inline">{getLocaleDay(End)}</span> {getLocaleDate(End)}</div>
					<div title={LanguagePrefix+Start.toString()}><Icon class="-small -baseline -gap" src="clock" /> Starts at <strong>{getLocaleTime(Start)}</strong> {getLocaleTimeZone(Start)} <Link href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></Link></div>
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
