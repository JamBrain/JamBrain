import {h, Component}					from 'preact/preact';
import UILink							from '../link/link';

export default class UIButtonLink extends UILink {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		props = Object.assign({}, props);

		let doHistory;
		if ( props.href ) {
			if ( !props.noblank && (props.href.indexOf('//') !== -1) ) {
				props.target = "_blank";
				props.rel = "noopener noreferrer";
			}
//			else if ( props.replace ) {
//				doHistory = this.onClickReplace.bind(this);
//				delete props.replace;
//			}
			else {
				doHistory = this.onClick;//Push.bind(this);
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
		};

		props.onkeydown = (e) => {
			if ( e.keyCode === 13 ) {
				props.onclick();
			}
		};

		return <a {...props} class={cN("ui-button", props.class)} />;
	}
}
