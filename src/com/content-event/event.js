import {h, Component} 				from 'preact/preact';
import NavLink 							from 'com/nav-link/link';
import UIIcon from 'com/ui/icon/icon';

import ContentCommonBody				from 'com/content-common/common-body';
import ContentCommonNav					from 'com/content-common/common-nav';
import ContentCommonNavButton			from 'com/content-common/common-nav-button';

import ContentSimple					from 'com/content-simple/simple';


export default class ContentEvent extends Component {
	constructor( props ) {
		super(props);
		this.onJoin = this.onJoin.bind(this);
	}

	onJoin( e ) {
		const featured = this.props.featured;
		window.location.hash = "#create/"+featured.id+"/item/game";
	}

	render( props, state ) {
		let {node, user, path, extra, featured} = props;
		props = Object.assign({}, props);

		if ( node ) {
			props.header = "EVENT";
			props.headerIcon = "trophy";
			props.headerClass = "-col-ab";
		}

    let ShowJoin = null;
    if ( user && user.id && node_CanCreate(node) ) {
      let Class = "-diabled";
      if ( extra && extra.length > 0 && extra[0] == "games") {
          Class = "-selected";
      }
			if ( !(featured && featured.what && featured.what.length) ) {
				ShowJoin = (
					<ContentCommonNavButton onclick={this.onJoin} class={Class} title="Join Event">
						<UIIcon>publish</UIIcon><div class="if-sidebar-inline">Join Event</div>
					</ContentCommonNavButton>
				);
			}
		}

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
				ShowEventTheme = <div><UIIcon small baseline gap>lightbulb</UIIcon> Theme: <strong>{node.meta['event-theme']}</strong></div>;
			}

			props.above.push(
				<ContentCommonBody>
					{ShowEventTheme}
					<div><UIIcon small baseline gap>calendar</UIIcon> {getLocaleDay(Start)} {getLocaleMonthDay(Start)} to <span class="if-sidebar-inline">{getLocaleDay(End)}</span> {getLocaleDate(End)}</div>
					<div title={LanguagePrefix+Start.toString()}><UIIcon small baseline gap>clock</UIIcon> Starts at <strong>{getLocaleTime(Start)}</strong> {getLocaleTimeZone(Start)} <NavLink href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></NavLink></div>
				</ContentCommonBody>
			);
		}

		if ( !(extra && extra.length == 0) ) {
			props.minimized = true;
		}

		return (
			<ContentSimple {...props}>
				<ContentCommonNav>
                    {ShowJoin}
				</ContentCommonNav>
			</ContentSimple>
		);
	}
}
