import ContentError from 'com/content/error';

import EventThemeIdea from 'com/content-event/event-idea';
import EventThemeSlaughter from 'com/content-event/event-slaughter';
import EventThemeFusion from 'com/content-event/event-fusion';
import EventThemeList from 'com/content-event/event-list';
//import ContentEventFinal from 'com/content-event/event-final';
//import ContentEventJudging from 'com/content-event/event-judging';
//import ContentEventResults from 'com/content-event/event-results';


export default function ContentEventTheme( props ) {
	const {node, user, path, extra} = props;

	if ( node.slug ) {
		const EventMode = (node.meta['event-mode']) ? Number(node.meta['event-mode']) : 0;

		var newPath = '/'+ (extra ? extra.join('/') : '');

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
				if ( Number(Page) > 0 ) {
					// MK NOTE: Should this be something more interesting then a number?
					RoundName = ""+idx;
				}
			}
		}
		if ( newPath === '/' ) {
			newPath = '/'+RoundName;
		}

		// MK NOTE: This could be replaced by router
		if ( newPath == '/idea' ) {
			return <EventThemeIdea node={node} user={user} path={path} extra={extra} />;
		}
		else if ( newPath == '/slaughter' ) {
			return <EventThemeSlaughter node={node} user={user} path={path} extra={extra} />;
		}
		else if ( newPath == '/fusion' ) {
			return <EventThemeFusion node={node} user={user} path={path} extra={extra} />;
		}
		else if ( Number(newPath.slice(1)) > 0 ) {
			return <EventThemeList node={node} user={user} path={path} extra={extra} />;
		}

		return null;
	}
	else {
		return <ContentError />;
	}
}
