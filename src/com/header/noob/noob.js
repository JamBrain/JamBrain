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
		if ( state.hidden )
			return <div />;

		return (
			<div class="header-base header-noob outside">
				<div class="-close" onclick={this.onClick}><SVGIcon>cross</SVGIcon></div>
				<div class="-title -gap _font2">Whoa! What's going on here?</div>
				<div class="-gap">We're making video games!</div>
				<div class="-gap"><strong>Ludum Dare</strong> is one of the world's largest and longest running Game Jam events. Every 4 months, we challenge creators to make a game <em>from scratch</em> in a weekend.</div>
				<div>You can check out the latest updates in the feed below.</div>
				<div>You can watch <strong>Live Streaming Video</strong> of people making games here: <NavLink href="//twitch.tv/communities/ludumdare"><SVGIcon>twitch</SVGIcon> twitch.tv/../ludumdare</NavLink></div>
				<div class="-gap">You can check out some of the amazing games that started in Ludum Dare here: <NavLink href="//store.steampowered.com/curator/537829-Ludum-Dare/"><SVGIcon>steam</SVGIcon> steampowered.com/../ludumdare</NavLink></div>
				<div>You can <NavLink href="/about">learn more about Ludum Dare here</NavLink></div>
			</div>
		);
	}
}
