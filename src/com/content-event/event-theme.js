import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

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
//		if ( node.slug ) {
//			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;
//
//			switch (ThemeMode) {
//				case 1:
//				EventBody = <ContentEventIdea node={node} user={user} path={_path} extra={_extra} />;
//				break;
//			case 2:
//				EventBody = <ContentEventSlaughter node={node} user={user} path={_path} extra={_extra} />;
//				break;
//			case 3:
//				EventBody = <ContentEventFusion node={node} user={user} path={_path} extra={_extra} />;
//				break;
//			case 4:
//				EventBody = <ContentEventList node={node} user={user} path={_path} extra={_extra} />;
//				break;
//
			
		
		return (
			<ContentCommon {...props}>
				Wine
			</ContentCommon>
		);
	}
}
