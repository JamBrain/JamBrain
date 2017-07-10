import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentError						from 'com/content-error/error';

import ContentEventHome					from 'com/content-event/event-home';
import ContentEventIdea					from 'com/content-event/event-idea';
import ContentEventSlaughter			from 'com/content-event/event-slaughter';
import ContentEventFusion				from 'com/content-event/event-fusion';
import ContentEventList					from 'com/content-event/event-list';
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
	
	componentDidMount() {
	}


	render( props ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		if ( node.slug ) {
			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;

			var NewPath = '/'+ (extra ? extra.join('/') : '');
			
			// Figure out Round Name (this needs to be done first, otherwise Defaults are set wrong)
			var RoundName = '';
			if ( ThemeMode >= 1 ) {
				RoundName = 'idea';
			}
			if ( ThemeMode >= 2 ) {
				RoundName = 'slaughter';
			}
			if ( ThemeMode >= 3 ) {
				RoundName = 'fusion';
			}
			if ( ThemeMode >= 4 ) {
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
				ShowBody = <ContentEventIdea node={node} user={user} path={path} extra={extra} />;
			}
			else if ( NewPath == '/slaughter' ) {
				ShowBody = <ContentEventSlaughter node={node} user={user} path={path} extra={extra} />;
			}
			else if ( NewPath == '/fusion' ) {
				ShowBody = <ContentEventFusion node={node} user={user} path={path} extra={extra} />;
			}
			else if ( parseInt(NewPath.substr(1)) > 0 ) {
				ShowBody = <ContentEventList node={node} user={user} path={path} extra={extra} />;
			}
			
			console.log( NewPath );
			
		
			return (
				<ContentCommon {...props}>
					<ContentCommonBody>{ShowBody}</ContentCommonBody>
				</ContentCommon>
			);
		}
		else {
			return <ContentError />;
		}
	}
}
