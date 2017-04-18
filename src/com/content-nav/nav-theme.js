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

			// Figure out Default Page (this needs to be done first, otherwise Defaults are set wrong)
			var DefaultPath = '/theme';
			if ( ThemeMode >= 1 ) {
				DefaultPath = '/theme/slaguhter';
			}
			if ( ThemeMode >= 2 ) {
				DefaultPath = '/theme/slaughter';
			}
			if ( ThemeMode >= 3 ) {
				DefaultPath = '/theme/fusion';
			}
			if ( ThemeMode >= 4 ) {
				for ( var idx = 1; idx <= 5; idx++ ) {	// 5 rounds max
					let Page = node.meta['theme-page-mode-'+idx];
					if ( parseInt(Page) > 0 ) {
						DefaultPath = '/theme/'+idx;
					}
				}
			}
			if ( NewPath === '/theme' || NewPath === '/theme/' ) {
				NewPath = DefaultPath;
			}

			// Populate Round Buttons
			var ShowRounds = [];
			if ( ThemeMode >= 1 ) {
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='suggestion' href={path+'/theme/idea'}>Suggestions</ContentNavButton>);
			}
			if ( ThemeMode >= 2 ) {
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='fire' href={path+'/theme/slaughter'}>Slaughter</ContentNavButton>);
			}
			if ( ThemeMode >= 3 ) {
				ShowRounds.push(<ContentNavButton path={path+NewPath} icon='heart-broken' href={path+'/theme/fusion'}>Fusion</ContentNavButton>);
			}
			if ( ThemeMode >= 4 ) {
				for ( var idx = 1; idx <= 5; idx++ ) {	// 5 rounds max
					var Page = node.meta['theme-page-mode-'+idx];
					if ( Page ) {
						let Name = "Round "+idx;
						if ( node.meta['theme-page-name-'+idx] )
							Name = node.meta['theme-page-name-'+idx];
						
						ShowRounds.push(<ContentNavButton path={path+NewPath} icon='ticket' href={path+'/theme/'+idx}>{Name}</ContentNavButton>);
					}
				}
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
