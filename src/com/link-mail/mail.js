import { Component} from 'preact';
import './mail.less';

import UIIcon			from 'com/ui/icon';

// TODO: Migrate me in to `NavLink`/`Link`

export default class LinkMail extends Component {
	constructor( props ) {
		super(props);
	}

	render( props/*, state*/ ) {
		let Href = props.href;// || (props.children && props.children.length && props.children[0]) || "";
		let Mail = '???';

		if ( Href.indexOf('mailto:') === 0 ) {
			Mail = props.slice(7); // strlen('mailto:')
		}
		else {
			Mail = Href;
			Href = 'mailto:' + Href;
		}

		return (
			<a class={`link-mail ${props.class ?? ''}`} href={Href} title={Mail}><UIIcon gap small baseline>mail</UIIcon>{Mail}</a>
		);
	}
}
