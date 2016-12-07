import { h, Component }				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class HeaderWhatsup extends Component {
	constructor( props ) {
		super(props);
	}

	render( {rows} ) {
		// NOTE: For Theme Voting, look at what's in 'available' returned by the theme list.
		// Then use that to check the name in 'names'. 
		
		// TODO: Write code to convert an array to "1 and 2" or "1, 2, and 3"
		
		return (
			<div class="header-base header-whatsup outside">
				<span class="-title _font2">ON NOW:</span> Ludum Dare 37 <NavLink href="/events/ludum-dare/37/theme"><SVGIcon baseline small gap>mallet</SVGIcon>Theme Voting</NavLink> Round 1, Round 2, and Round 3
			</div>
		);
	}
}
