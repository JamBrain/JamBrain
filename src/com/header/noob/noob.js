import { Component } from 'preact';
import './noob.less';
import '../header.less';

import {Icon, Link, Button} from 'com/ui';
import {BasicAside, Header, Section, Footer} from "com/content/basic";

export default class ContentHeaderNoob extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'hidden': false
		};

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.setState({'hidden': true});
	}

	render( props, state ) {
		return state.hidden ? null : (
			<BasicAside class="-noob">
				<Header class="_font2" title="What is Ludum Dare?" />
				<Section>
					<p>
						<Link href="/about">Ludum Dare</Link> is an online event where games are made from scratch in a weekend. Check us out every April and October!
					</p>
				</Section>
				<Button class="close" onClick={this.onClick}><Icon>cross</Icon></Button>
			</BasicAside>
		);
	}
}
