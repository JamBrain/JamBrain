import {h, Component} from 'preact';

import ContentError from 'com/content/error';

import EventThemeIdea					from 'com/content-event/event-idea';
import EventThemeSlaughter			from 'com/content-event/event-slaughter';
import EventThemeFusion				from 'com/content-event/event-fusion';
import EventThemeList					from 'com/content-event/event-list';
//import ContentEventFinal				from 'com/content-event/event-final';
//import ContentEventJudging				from 'com/content-event/event-judging';
//import ContentEventResults				from 'com/content-event/event-results';


import ButtonBase						from 'com/button-base/base';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBody				from 'com/content-common/common-body';


export default class ContentEventTheme extends Component {
	constructor( props ) {
		super(props);

	}

	render( props ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		if ( node.slug ) {
			let EventMode = (node.meta['event-mode']) ? parseInt(node.meta['event-mode']) : 0;

			var NewPath = '/'+ (extra ? extra.join('/') : '');

			// Figure out Round Name (this needs to be done first, otherwise Defaults are set wrong)
			var RoundName = '';
			if ( EventMode >= 1 ) {
				RoundName = 'idea';
			}
			if ( EventMode >= 2 ) {
				RoundName = 'slaughter';
			}
			if ( EventMode >= 3 ) {
				RoundName = 'fusion';
			}
			if ( EventMode >= 4 ) {
				for ( var idx = 1; idx <= 5; idx++ ) {	// 5 rounds max
					let Page = node.meta['theme-page-mode-'+idx];
					if ( parseInt(Page) > 0 ) {
						RoundName = idx;
					}
				}
			}
			if ( NewPath === '/' ) {
				NewPath = '/'+RoundName;
			}


			var ShowBody = null;
			if ( NewPath == '/idea' ) {
				ShowBody = <EventThemeIdea node={node} user={user} path={path} extra={extra} />;
			}
			else if ( NewPath == '/slaughter' ) {
				ShowBody = <EventThemeSlaughter node={node} user={user} path={path} extra={extra} />;
			}
			else if ( NewPath == '/fusion' ) {
				ShowBody = <EventThemeFusion node={node} user={user} path={path} extra={extra} />;
			}
			else if ( parseInt(NewPath.slice(1)) > 0 ) {
				ShowBody = <EventThemeList node={node} user={user} path={path} extra={extra} />;
			}

			return ShowBody;
		}
		else {
			return <ContentError />;
		}
	}
}
