import {h, Component} from 'preact/preact';
import SVGIcon from 'com/svg-icon/icon';

export default class MailLink extends Component {
	
	constructor (props) {
		super(props);		
	}
		
	render( props, state ) {
		
		if (props.href.startsWith('mailto:')) {
			href = props.href;
			mail = props.substring(7);
		} else {
			href = 'mailto:' + props.href;
			mail = props.href;
		}
		
		return (
			<span class="mail-link">				
				<a class={cN('mail')} href={href} title={mail}><SVGIcon gap>mail</SVGIcon><strong class="-the-rest">{mail}</strong></a>
			</span>);
	}
}