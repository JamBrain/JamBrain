import './button.less';
import './button-link.less';

import {Link} from '../link';

/** @deprecated */
export default class UIButtonLink extends Link {
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
		let onClickFunc = props.onClick;
		props.onClick = (e) => {
			if ( onClickFunc ) {
				onClickFunc(e);
			}

			if ( doHistory ) {
				doHistory.call(this.base, e);
			}

			if ( document.activeElement instanceof HTMLElement ) {
				document.activeElement.blur();
			}
			// SVG Elements on Internet Explorer have no blur() method, so call the parent's blur //
			else if ( document.activeElement.parentNode instanceof HTMLElement ) {
				document.activeElement.parentNode.blur();
			}
		};

		props.onKeyDown = (e) => {
			if ( e.keyCode === 13 ) {
				props.onClick();
			}
		};

		//return super.render({...props, class={cN("ui_button", props.disabled ? "-disabled" : null, props.class)});
		return <a {...props} class={`ui_button ${props.disabled ? "-disabled" : ''} ${props.class ?? ''}`} />;
	}
}
