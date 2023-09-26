import { Component } from 'preact/preact';

export default class CoreButton extends Component {
	render(props,state) {
		if ( !props.hasOwnProperty('tabIndex') )
			props.tabIndex="0";

		if ( props.hasOwnProperty('class') )
			props.class += " core-button";
		else
			props.class = "core-button";

		if ( props.hasOwnProperty('onClick') ) {
			// As long as you don't set the "keep focus" property //
			if ( !props.hasOwnProperty('keepFocus') ) {
				// Wrap onClick with a function that deselects current element //
				let oldClick = props.onClick;
				props.onClick = (e) => {
					oldClick(e);
					document.activeElement.blur();
				}
			}

			props.onKeyDown = (e) => {
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
