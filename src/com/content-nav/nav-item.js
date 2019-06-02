import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavItem extends Component {
	constructor( props ) {
		super(props);
	}

	render( {node, user, path, extra}, {} ) {
		var NewPath = '/'+ (extra ? extra.join('/') : '');

		// Default to /hot if not logged in
		if ( NewPath === '/' ) {
			NewPath = '/comments';
		}

		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					<ContentNavButton path={path+NewPath} title="Comments" icon='bubbles' href={path+'/comments'}>Comments</ContentNavButton>
				</div>
			</div>
		);

//					<ContentNavButton path={path+NewPath} icon='feed' title="Feed" href={path+'/feed'}>Feed</ContentNavButton>
	}
}
