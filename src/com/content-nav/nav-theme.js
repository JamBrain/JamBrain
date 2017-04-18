import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';
import ContentError						from 'com/content-error/error';


export default class ContentNavTheme extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( {node, user, path, extra}, {} ) {
		if ( node.slug ) {
			let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;
	
			var NewPath = '/'+ (extra ? extra.join('/') : '');
			if ( NewPath === '/theme' ) {
				NewPath = '/theme/1';
			}
			
			var ShowRounds = [];
			if ( ThemeMode >= 1 )
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='suggestion' href={path+'/theme/idea'}>Suggestions</ContentNavButton>);
			if ( ThemeMode >= 2 )
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='fire' href={path+'/theme/slaughter'}>Slaughter</ContentNavButton>);
			if ( ThemeMode >= 3 )
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='heart-broken' href={path+'/theme/fusion'}>Fusion</ContentNavButton>);
			if ( ThemeMode >= 4 ) {
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='ticket' href={path+'/theme/1'}>Round 1</ContentNavButton>);
			}
	
			
			return (
				<div class="-body">
					<div class="content-base content-nav content-nav-root">
						{ShowRounds}
					</div>
				</div>
			);
		}
		else {
			return null;
//			return <ContentError />;
		}
	}
}
