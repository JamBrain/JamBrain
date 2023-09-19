import './whatsup.less';
import '../header.less';

import {Icon, Link} from 'com/ui';

export default function HeaderWhatsup( props ) {
	let {node, user, path, extra, featured} = props;

	if ( featured && featured.meta ) {
		if ( Number(featured.meta['event-mode']) == 1 ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">ON NOW:</span> {featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="lightbulb" /> Theme Suggestions</Link> are open!
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 2 ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">ON NOW:</span> {featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="fire" /> Theme Slaughter Round</Link>
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 3 ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">ON NOW:</span> {featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="fire" /> Theme Fusion Round</Link>
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 4 ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">ON NOW:</span> {featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="ticket" /> Theme Voting</Link>
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 5 ) {
			// Theme is revealed
			if ( featured.meta['event-theme'] ) {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> <Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
					</aside>
				);
			}
			// Theme is not yet revealed
			else {
				return (
					<aside class="header -whatsup outside">
						<span class="-title _font2">ON NOW:</span> <Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> Theme Announcement Soon! <Link href="https://twitter.com/ludumdare"><Icon class="-baseline -small" src="twitter" /> Check Twitter</Link>
					</aside>
				);
			}
		}
		else if ( Number(featured.meta['event-mode']) == 6 && featured.meta['event-theme'] ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">RATINGS+FEEDBACK & EXTRA ON NOW:</span> <Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 7 && featured.meta['event-theme'] ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">RESULTS SOON:</span> <Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link>. This can take a while (hours). <Link href="https://twitter.com/ludumdare"><Icon class="-baseline -small" src="twitter" /> Stay tuned</Link>
				</aside>
			);
		}
		else if ( Number(featured.meta['event-mode']) == 8 && featured.meta['event-theme'] ) {
			return (
				<aside class="header -whatsup outside">
					<span class="-title _font2">RESULTS:</span> <Link href={featured.path+'/results'}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link>
				</aside>
			);
		}
	}

	return null;
}
