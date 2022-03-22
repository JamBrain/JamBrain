import {h, Component} from 'preact';
import {UIIcon, UILink, UIButton} from 'com/ui';
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
			<ContentSimple class="-header -noob" title="What is Ludum Dare?">
				<p><UILink href="/about">Ludum Dare</UILink> is an online event where games are made from scratch in a weekend. Check us out every April and October!</p>
				<UIButton class="close" onClick={this.onClick}><UIIcon>cross</UIIcon></UIButton>
			</ContentSimple>
		);
		/*
		return (
			<aside class="content -header -noob">
				<article>
					<h1>What is Ludum Dare?</h1>
					<p><UILink href="/about">Ludum Dare</UILink> is an online event where games are made from scratch in a weekend. Check us out every April and October!</p>
				</article>
				<div class="close" onClick={this.onClick}><UIIcon>cross</UIIcon></div>
			</aside>
		);
		*/
	}
}
