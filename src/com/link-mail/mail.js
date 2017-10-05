import {h, Component} 				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';

// TODO: Migrate me in to `NavLink`/`Link`

export default class LinkMail extends Component {
	constructor( props ) {
		super(props);
	}

	render( props/*, state*/ ) {
		let Href = props.href;// || (props.children && props.children.length && props.children[0]) || "";
		let Mail = '???';

		if ( Href.indexOf('mailto:') === 0 ) {
			Mail = props.substr(7); // strlen('mailto:')
		}
		else {
			Mail = Href;
			Href = 'mailto:' + Href;
		}

		return (
			<a class={cN("link-mail", props.class)} href={Href} title={Mail}><SVGIcon gap small baseline>mail</SVGIcon>{Mail}</a>
		);
	}
}
