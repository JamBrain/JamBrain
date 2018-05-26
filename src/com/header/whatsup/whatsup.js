import {h, Component}				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class HeaderWhatsup extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra, featured} = props;

		if ( featured ) {
			if ( featured.meta ) {
				if ( parseInt(featured.meta['theme-mode']) == 1 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path+'/theme'}><SVGIcon baseline small gap>suggestion</SVGIcon>Theme Suggestions</NavLink> are open!
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 2 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path+'/theme'}><SVGIcon baseline small gap>fire</SVGIcon>Theme Slaughter Round</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 3 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path+'/theme'}><SVGIcon baseline small gap>fire</SVGIcon>Theme Fusion Round</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 4 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path+'/theme'}><SVGIcon baseline small gap>ticket</SVGIcon>Theme Voting</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 5 ) {
					// Theme is revealed
					if ( featured.meta['event-theme'] ) {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">ON NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
							</div>
						);
					}
					// Theme is not yet revealed
					else {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">ON NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> Theme Announcement Soon! <NavLink href="https://twitter.com/ludumdare"><SVGIcon baseline small gap>twitter</SVGIcon>Check Twitter</NavLink>
							</div>
						);
					}
				}
				else if ( parseInt(featured.meta['theme-mode']) == 6 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">PLAY+RATE NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 7 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">RESULTS SOON:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink>. This can take a while (hours). <NavLink href="https://twitter.com/ludumdare"><SVGIcon baseline small gap>twitter</SVGIcon>Stay tuned</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 8 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">RESULTS:</span> <NavLink href={featured.path+'/results'}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink>
						</div>
					);
				}
			}
		}

		return null;
	}
}
