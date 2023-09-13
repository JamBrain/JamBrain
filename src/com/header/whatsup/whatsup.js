import { Component } from 'preact';
import UIIcon 						from 'com/ui/icon/icon';
import UILink 						from 'com/ui/link/link';

export default class HeaderWhatsup extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra, featured} = props;

		if ( featured && featured.meta ) {
			if ( Number(featured.meta['event-mode']) == 1 ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="lightbulb" /> Theme Suggestions</UILink> are open!
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 2 ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="fire" /> Theme Slaughter Round</UILink>
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 3 ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="fire" /> Theme Fusion Round</UILink>
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 4 ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> {featured.name} <UILink href={featured.path+'/theme'}><UIIcon baseline small src="ticket" /> Theme Voting</UILink>
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 5 ) {
				// Theme is revealed
				if ( featured.meta['event-theme'] ) {
					return (
						<aside class="header -whatsup outside">
							<span class="-title _font2">ON NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
						</aside>
					);
				}
				// Theme is not yet revealed
				else {
					return (
						<aside class="header -whatsup outside">
							<span class="-title _font2">ON NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> Theme Announcement Soon! <UILink href="https://twitter.com/ludumdare"><UIIcon baseline small src="twitter" /> Check Twitter</UILink>
						</aside>
					);
				}
			}
			else if ( Number(featured.meta['event-mode']) == 6 && featured.meta['event-theme'] ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">RATINGS+FEEDBACK & EXTRA ON NOW:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 7 && featured.meta['event-theme'] ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">RESULTS SOON:</span> <UILink href={featured.path}><UIIcon baseline small src="trophy" /> {featured.name}</UILink>. This can take a while (hours). <UILink href="https://twitter.com/ludumdare"><UIIcon baseline small src="twitter" /> Stay tuned</UILink>
					</aside>
				);
			}
			else if ( Number(featured.meta['event-mode']) == 8 && featured.meta['event-theme'] ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">RESULTS:</span> <UILink href={featured.path+'/results'}><UIIcon baseline small src="trophy" /> {featured.name}</UILink>
					</aside>
				);
			}
		}

		return null;
	}
}
