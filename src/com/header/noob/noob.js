import {h, Component} from 'preact';
import {UIIcon, UILink, UIButton} from 'com/ui';
import {BasicAside, Header, Section, Footer} from "com/content/basic";

import ContentSimple from 'com/content/simple';

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
		return state.hidden ? null : (
			<BasicAside class="-noob">
				<Header class="_font2" title="What is Ludum Dare?" />
				<Section>
					<p><UILink href="/about">Ludum Dare</UILink> is an online event where games are made from scratch in a weekend. Check us out every April and October!</p>
					<UIButton class="close" onClick={this.onClick}><UIIcon>cross</UIIcon></UIButton>
				</Section>
			</BasicAside>
		);
	}
}
