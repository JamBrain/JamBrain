import { h, Component }				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';
import NavLink 						from 'com/nav-link/link';

export default class ContentHeaderNoob extends Component {
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
			<aside class="content -header -noob">
				<article>
					<h1>What is Ludum Dare?</h1>
					<p><NavLink href="/about">Ludum Dare</NavLink> is an online event where games are made from scratch in a weekend. Check us out every April and October!</p>
				</article>
				<div class="close" onclick={this.onClick}><SVGIcon>cross</SVGIcon></div>
			</aside>
		);
	}
}
