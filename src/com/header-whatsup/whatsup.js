import { h, Component }				from 'preact/preact';
import SVGIcon 					from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class HeaderWhatsup extends Component {
	constructor( props ) {
		super(props);
	}

	render( {rows} ) {
		return (
			<div class="header-base header-whatsup">
				<span class="-title _font2">ON NOW:</span> <NavLink href="/events/ludum-dare/37/theme"><SVGIcon>mallet</SVGIcon>Theme Voting</NavLink> Round 1, Round 2, and Round 3
			</div>
		);
	}
}
