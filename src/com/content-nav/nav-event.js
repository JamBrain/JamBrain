import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavEvent extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( {node, user, path, extra}, {} ) {
		var NewPath = '/'+ (extra ? extra.join('/') : '');
		
		var ShowMyFeed = null;
		if ( user && user.id ) {
			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href={path}>Feed</ContentNavButton>;
		}
		// Default to /hot if not logged in
		else if ( NewPath === '/' ) {
			NewPath = '/hot';
		}
		
		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					{ShowMyFeed}
					<ContentNavButton path={NewPath} icon='heart' href={path+'/hot'}>Popular</ContentNavButton>
					<ContentNavButton path={NewPath} icon='news' href={path+'/news'}>News</ContentNavButton>
					<ContentNavButton path={NewPath} icon='gamepad' href={path+'/games'}>Games</ContentNavButton>
				</div>
			</div>
		);
	}
}
