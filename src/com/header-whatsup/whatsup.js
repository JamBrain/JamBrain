import { h, Component }				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class HeaderWhatsup extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		var featured = props.featured;
		
		// NOTE: For Theme Voting, look at what's in 'available' returned by the theme list.
		// Then use that to check the name in 'names'. 
		
		// TODO: Write code to convert an array to "1 and 2" or "1, 2, and 3"
		
		// TODO: The actual theme can be found in the the public metatag "event-theme" (private one before event)
		
//		return null;


//		return (
//			<div class="header-base header-whatsup outside">
//				<span class="-title _font2">ON NOW:</span> Ludum Dare 38 <NavLink href="/events/ludum-dare/38/theme"><SVGIcon baseline small gap>suggestion</SVGIcon>Theme Suggestions</NavLink> are open
//			</div>
//		);

//		return (
//			<div class="header-base header-whatsup outside">
//				<span class="-title _font2">ON NOW:</span> Ludum Dare 38 <NavLink href="/events/ludum-dare/38"><SVGIcon baseline small gap>fire</SVGIcon>Theme Slaughter</NavLink>
//			</div>
//		);


		if ( featured ) {
			if ( featured.meta ) {
				if ( parseInt(featured.meta['theme-mode']) == 1 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path}><SVGIcon baseline small gap>suggestion</SVGIcon>Theme Suggestions</NavLink> are open!
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 2 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path}><SVGIcon baseline small gap>fire</SVGIcon>Theme Slaughter Round</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 3 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path}><SVGIcon baseline small gap>fire</SVGIcon>Theme Fusion Round</NavLink>
						</div>
					);
				}
				else if ( parseInt(featured.meta['theme-mode']) == 4 ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">ON NOW:</span> {featured.name} <NavLink href={featured.path}><SVGIcon baseline small gap>ticket</SVGIcon>Theme Voting</NavLink>
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
				else if ( parseInt(featured.meta['theme-mode']) == 8 && featured.meta['event-theme'] ) {
					return (
						<div class="header-base header-whatsup outside">
							<span class="-title _font2">RESULTS:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink>
						</div>
					);
				}
			}
		}

		return null; // HACK HAAAAAAAAAAACK!


		if ( featured ) {
			if ( featured.meta ) {
				if ( featured.meta['event-theme'] ) {
					if ( featured.meta['can-grade'] ) {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">JUDGING NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
							</div>
						);						
					}
					else {
						return (
							<div class="header-base header-whatsup outside">
								<span class="-title _font2">ON NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}
								<br /><br />Judging will start <del>Friday</del> Sunday. See <NavLink href="/news">the News</NavLink>. Contact <NavLink href="/contact">Mike</NavLink> if you need help
							</div>
						);
					}
				}
			}

//							<br /><br />Wow! Sorry about the site! Judging will start <del>Wednesday</del> Friday.
//							<br /><NavLink href="https://twitter.com/mikekasprzak"><SVGIcon baseline small gap>twitter</SVGIcon>Mike</NavLink> wants to take Tuesday to be sure we got all the submissions.
//							<br /><NavLink href="/contact">Contact Mike</NavLink> if you need help. PS: <NavLink href="https://twitter.com/mikekasprzak/status/856708287856746497">We set a record</NavLink>. Still going!

//							<br /><br />Game Publishing (Submission) is coming! Sorry for the <NavLink href="https://twitter.com/mikekasprzak"><SVGIcon baseline small gap>twitter</SVGIcon>delay</NavLink>!
//							<br />We will make sure you get your compo games in the compo!
			
			return (
				<div class="header-base header-whatsup outside">
					<span class="-title _font2">ON NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> Theme Announcement Soon! <NavLink href="https://twitter.com/ludumdare"><SVGIcon baseline small gap>twitter</SVGIcon>Check Twitter</NavLink>
				</div>
			);
		}
		return null;

//					<span class="-title _font2">ON NOW:</span> <NavLink href={featured.path}><SVGIcon baseline small gap>trophy</SVGIcon>{featured.name}</NavLink> Final Round Theme Voting
		
//				<span class="-title _font2">ON NOW:</span> <NavLink href="/events/ludum-dare/38"><SVGIcon baseline small gap>trophy</SVGIcon>Ludum Dare 38</NavLink> Final Round Theme Voting

//				<span class="-title _font2">ON NOW:</span> <NavLink href="/events/ludum-dare/38"><SVGIcon baseline small gap>trophy</SVGIcon>Ludum Dare 38</NavLink> <SVGIcon baseline small gap>ticket</SVGIcon>Theme Voting

//				<span class="-title _font2">{"Theme:"}</span>{" One room"}

//				<NavLink href="/events/ludum-dare/37/theme"><SVGIcon baseline small gap>mallet</SVGIcon>Theme Voting</NavLink> has ended. The theme will be announced soon.

// Yes, if you're watching the source code, we're going to have to do this manually.
//				<span class="-title _font2">{"Theme:"}</span>{" ???"}

//				<span class="-title _font2">ON NOW:</span> Ludum Dare 37 <NavLink href="/events/ludum-dare/37/theme"><SVGIcon baseline small gap>mallet</SVGIcon>Theme Voting</NavLink> Final Round!

//				<span class="-title _font2">ON NOW:</span> Ludum Dare 37 <NavLink href="/events/ludum-dare/37/theme"><SVGIcon baseline small gap>mallet</SVGIcon>Theme Voting</NavLink> Round 1, Round 2, and Round 3
	}
}
