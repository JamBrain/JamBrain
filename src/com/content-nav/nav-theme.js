import {h, Component} 				from 'preact/preact';
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
			let EventMode = (node.meta['event-mode']) ? parseInt(node.meta['event-mode']) : 0;

			var NewPath = '/'+ (extra ? extra.join('/') : '');

			// Figure out Default Page (this needs to be done first, otherwise Defaults are set wrong)
			var DefaultPath = '';
			if ( EventMode >= 1 ) {
				DefaultPath = '/idea';
			}
			if ( EventMode >= 2 ) {
				DefaultPath = '/slaughter';
			}
			if ( EventMode >= 3 ) {
				DefaultPath = '/fusion';
			}
			if ( EventMode >= 4 ) {
				for ( var idx = 1; idx <= 5; idx++ ) {	// 5 rounds max
					let Page = node.meta['theme-page-mode-'+idx];
					if ( parseInt(Page) > 0 ) {
						DefaultPath = '/'+idx;
					}
				}
			}
			if ( NewPath === '/' ) {
				NewPath = DefaultPath;
			}

			// Populate Round Buttons
			var ShowRounds = [];
//			if ( EventMode >= 1 ) {
//				ShowRounds.push(<ContentNavButton path={path+NewPath} title="Theme Suggestions" icon='suggestion' href={path+'/idea'}>Suggestions</ContentNavButton>);
//			}
//			if ( EventMode >= 2 ) {
//				ShowRounds.push(<ContentNavButton path={path+NewPath} title="Theme Slaughter" icon='fire' href={path+'/slaughter'}>Slaughter</ContentNavButton>);
//			}
//			if ( EventMode >= 3 ) {
//				ShowRounds.push(<ContentNavButton path={path+NewPath} title="Theme Fusion" icon='heart-broken' href={path+'/fusion'}>Fusion</ContentNavButton>);
//			}
			if ( EventMode >= 4 ) {
				for ( var idx = 1; idx <= 5; idx++ ) {	// 5 rounds max
					var Page = node.meta['theme-page-mode-'+idx];
					if ( Page ) {
						let Name = "Round "+idx;
						if ( node.meta['theme-page-name-'+idx] )
							Name = node.meta['theme-page-name-'+idx];

						ShowRounds.push(<ContentNavButton path={path+NewPath} title={Name} icon="ticket" href={path+'/'+idx}>{Name}</ContentNavButton>);
					}
				}
			}

			return (
				<div class="content content-nav content-nav-root">
					{ShowRounds}
				</div>
			);
		}
		else {
			return null;
//			return <ContentError />;
		}
	}
}
