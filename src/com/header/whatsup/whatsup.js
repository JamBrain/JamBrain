import {h, Component}				from 'preact/preact';
import UIIcon 						from 'com/ui/icon/icon';
import UILink 						from 'com/ui/link/link';

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
							<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="suggestions" /> Theme Suggestions</UILink> are open!
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 2 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="fire" /> Theme Slaughter Round</UILink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 3 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="fire" /> Theme Fusion Round</UILink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 4 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="ticket" /> Theme Voting</UILink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 5 ) {
					// Theme is revealed
					if ( featured.meta['event-theme'] ) {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">ON NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
							</div>
						);
					}
					// Theme is not yet revealed
					else {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">ON NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> Theme Announcement Soon! <UILink href="https://twitter.com/ludumdare"><UIIcon baseline small src="twitter" /> Check Twitter</UILink>
							</div>
						);
					}
				}
				else if ( parseInt(featured.meta['theme-mode']) == 6 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">PLAY+RATE NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 7 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">RESULTS SOON:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink>. This can take a while (hours). <UILink href="https://twitter.com/ludumdare"><UIIcon baseline small src="twitter" /> Stay tuned</UILink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 8 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">RESULTS:</span> <UILink href={featured.path+'/results'}><UIIcon baseline small src="trophy" /> {featured.name}</UILink>
						</div>
					);
				}
			}
		}

		return null;
	}
}
