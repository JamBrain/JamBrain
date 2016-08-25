import { h, Component } from 'preact/preact';
import NavLink 			from 'com/nav-link/link';

export default class ButtonLink extends NavLink {
	render(props,state) {
		if ( props.class )
			props.class = "button-base button-link " + props.class;
		else
			props.class = "button-base button-link";

		let doHistory;
		if ( props.href ) {
			if ( props.href.indexOf('//') !== -1 ) {		
				props.target = "_blank";
			}
			else if ( props.replace ) {
				doHistory = this.onClickReplace;
				delete props.replace;
			}
			else {
				doHistory = this.onClickPush;
			}
		}

		// Wrap onClick with a function that deselects current element //
		let onClickFunc = props.onclick;
		props.onclick = (e) => {
			if ( onClickFunc )
				onClickFunc(e);
			
			if ( doHistory )
				doHistory.call(this.base,e);
			
			if ( typeof document.activeElement.blur !== "undefined" ) {
				document.activeElement.blur();
			}
			// SVG Elements on Internet Explorer have no blur() method, so call the parent's blur //
			else if ( document.activeElement.parentNode.blur ) {
				document.activeElement.parentNode.blur();
			}
		}
		
		props.onkeydown = (e) => {
			if ( e.keyCode === 13 ) {
				props.onclick()
			}
		};
			
		return (
			<a {...props} />
		);
	}
}
