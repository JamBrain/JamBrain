import {h, Component}					from 'preact/preact';

export default class UIButtonDiv extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		props = Object.assign({}, props);

//		if ( !props.hasOwnProperty('tabIndex') )
		if ( props.tabIndex != null )
			props.tabIndex = "0";

		if ( props.onclick ) {
			// As long as you don't set the "keep focus" property //
			if ( !props.keepFocus ) {
				// Wrap onClick with a function that deselects current element //
				let func = props.onclick;
				props.onclick = (e) => {
					func(e);
					if ( typeof document.activeElement.blur !== "undefined" ) {
						document.activeElement.blur();
					}
					// SVG Elements on Internet Explorer have no blur() method, so call the parent's blur //
					else if ( document.activeElement.parentNode.blur ) {
						document.activeElement.parentNode.blur();
					}
				};
			}

			props.onkeydown = (e) => {
				if ( e.keyCode === 13 ) {
					props.onclick();
				}
			};
		}

		return <div {...props} class={cN("ui-button", props.class)} />;
	}
}
