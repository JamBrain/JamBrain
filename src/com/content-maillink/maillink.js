import {h, Component} 				from 'preact/preact';
import SVGIcon 						from 'com/svg-icon/icon';

export default class InlineMail extends Component {
	constructor (props) {
		super(props);		
	}
		
	render( props, state ) {
		if ( props.href && props.href.indexOf('mailto:') === 0 ) {
			href = props.href;
			mail = props.substr(7);
		}
		else {
			href = 'mailto:' + props.href;
			mail = props.href;
		}
		
		return (
			<span class="inline-mail">				
				<a href={href} title={mail}><SVGIcon gap small baseline>mail</SVGIcon>{mail}</a>
			</span>
		);
	}
}
