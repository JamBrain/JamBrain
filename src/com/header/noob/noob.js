import { h, Component }				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class HeaderNoob extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'hidden': false
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		this.setState({'hidden': true});
	}

	render( props, state ) {
		if ( state.hidden ) {
			return null;
		}

		return (
			<div class="content-base content-common content-simple content-noob">
				<div class="-close" onclick={this.onClick}><SVGIcon>cross</SVGIcon></div>
				<div class="-title -gap _font2">What is Ludum Dare?</div>
				<div><NavLink href="/about"><strong>Ludum Dare</strong></NavLink> is an online event where games are made from scratch in a weekend. Check us out every April and October!</div>
			</div>
		);
	}
}
