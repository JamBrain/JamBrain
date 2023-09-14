import './button.less';

export default function UIButtonDiv( props ) {
	props = {...props};

	if ( props.tabIndex !== null ) {
		props.tabIndex = "0";
	}

	if ( props.onClick ) {
		// As long as you don't set the "keep focus" property //
		if ( !props.keepFocus ) {
			// Wrap onClick with a function that deselects current element //
			let func = props.onClick;
			props.onClick = (e) => {
				func(e);
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur();
				}
				// SVG Elements on Internet Explorer have no blur() method, so call the parent's blur //
				else if (document.activeElement.parentNode instanceof HTMLElement) {
					document.activeElement.parentNode.blur();
				}
			};
		}

		props.onKeyDown = (e) => {
			if ( e.keyCode === 13 ) {
				props.onClick();
			}
		};
	}

	return <div {...props} class={`ui-button ${props.disabled ? "-disabled" : ''} ${!props.onClick ? "-null" : ''} ${props.class ?? ''}`} />;
}
