import {h, Component} 					from 'preact/preact';
import UIIcon 							from 'com/ui/icon/icon';
import UIButton							from 'com/ui/button/button';


export default class ContentNavButton extends Component {
	render( props ) {
		let Body = [];
		let Classes = [
			props.class
		];

		if ( (props.path === props.href) || (props.path === props.match) ) {
			Classes.push('-selected');
		}

		if ( props.light ) {
			Classes.push('-light');
		}

		if ( props.icon ) {
			Body.push(<UIIcon src={props.icon} />);
			Classes.push('-has-icon');
		}

		Body.push(<span>{props.children}</span>);

		return (
			<UIButton {...props} class={cN(Classes)}>{Body}</UIButton>
		);
	}
}
