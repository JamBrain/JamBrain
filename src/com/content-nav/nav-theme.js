import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavTheme extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( {node, user, path, extra}, {} ) {
		var NewPath = '/'+ (extra ? extra.join('/') : '');
		
		if ( NewPath === '/theme' ) {
			NewPath = '/theme/1';
		}
		
		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					<ContentNavButton path={path+NewPath} icon='suggestion' href={path+'/theme/idea'}>Suggestions</ContentNavButton>
					<ContentNavButton path={path+NewPath} icon='fire' href={path+'/theme/slaughter'}>Slaughter</ContentNavButton>
					<ContentNavButton path={path+NewPath} icon='ticket' href={path+'/theme/1'}>Round 1</ContentNavButton>
				</div>
			</div>
		);
	}
}
