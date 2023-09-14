import { Component } from 'preact';
import './nav.less';

import { UIIcon, UIButton } from 'com/ui';


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
			<UIButton {...props} class={Classes.join(' ')}>{Body}</UIButton>
		);
	}
}
