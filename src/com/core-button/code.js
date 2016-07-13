import { h, Component } from 'preact/preact';

export default class CoreButton extends Component {
	render(props,state) {
		if ( !props.hasOwnProperty('tabIndex') )
			props.tabIndex="0";

		if ( props.hasOwnProperty('class') )
			props.class += " core-button";
		else
			props.class = "core-button";
			
		if ( props.hasOwnProperty('onClick') ) {
			props.onKeyDown = e => {
				if ( e.keyCode === 13 ) {
					props.onClick()
				}
			};
		}
			
		return (
			<div {...props} />
		);
	}
}
