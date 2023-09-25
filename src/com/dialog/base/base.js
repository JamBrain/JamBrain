import { Component } from 'preact';
import './base.less';
import {navigateToLocalURL} from 'com/ui';

let dialogList = {};


function closeDialog() {
	navigateToLocalURL('?a=');
}

function onDialogClick( e ) {
	// Don't allow children to do anything
	e.preventDefault();
	e.stopPropagation();
}

function getFocusables() {
	return document.getElementsByClassName("focusable");
}

function onFocusEvent( e ) {
	const focusables = getFocusables();

	// Bail if nothing to focus on
	if ( !focusables.length )
		return;

	// If the active element is a focusable, we don't need to take focus away from it
	if ( focusables[document.activeElement.id] )
		return;

	// Focus the first focusable element
	const firstFocusable = focusables[0];
	if ( firstFocusable && firstFocusable instanceof HTMLElement ) {
		firstFocusable.focus();
	}

	e.preventDefault();
}

/**
 * @param {KeyboardEvent} e
 */
function onKeyboardEventTab( e ) {
	if ( e.code == "Tab" ) {
		const focusables = getFocusables();

		// Nothing to focus on
		if ( !focusables.length ) {
			e.preventDefault();
			return true;
		}

		if ( !e.shiftKey ) {
			// If no focusable has focus, or focus is on the last focusable element
			if ( !focusables[document.activeElement.id] || (focusables[document.activeElement.id] == focusables[focusables.length-1]) ) {
				// Focus on the first focusable element
				const firstFocusable = focusables[0];
				if ( firstFocusable && firstFocusable instanceof HTMLElement ) {
					firstFocusable.focus();
				}
			}
		}
		else {
			// If no focusable has focus, or focus is on the first focusable element
			if ( !focusables[document.activeElement.id] || (focusables[document.activeElement.id] == focusables[0]) ) {
				// Focus on the last focusable element
				const lastFocusable = focusables[focusables.length-1];
				if ( lastFocusable && lastFocusable instanceof HTMLElement ) {
					lastFocusable.focus();
				}
			}
		}
/*
		// Nothing in focus
		if ( !focusables[document.activeElement.id] ) {
			e.preventDefault();
			focusables[0].focus();
		}
		//
		else if ( !e.shiftKey && (focusables[document.activeElement.id] == focusables[focusables.length-1]) ) {
			e.preventDefault();
			focusables[0].focus();
		}
		else if ( e.shiftKey && (focusables[document.activeElement.id] == focusables[0]) ) {
			e.preventDefault();
			focusables[focusables.length-1].focus();
		}
		*/

		e.preventDefault();
		return true;
	}

	return false;
}

/**
 * @param {KeyboardEvent} e
 */
function onKeyboardEventTabEscape( e ) {
	if ( onKeyboardEventTab(e) ) {
		return true;
	}
	else if ( e.code == "Escape" ) {
		closeDialog();

		e.preventDefault();
		return true;
	}

	return false;
}



export default class DialogBase extends Component {
	/*
	constructor( props ) {
		super(props);

		this.eventKey = this.eventKey.bind(this);
		this.eventFocus = this.eventFocus.bind(this);
	}
	*/

	// "explicit" means we disable shortcuts that easily close the dialog (clicking outside, pushing ESC)
	// MK TODO: this needs a better name. Modal? Required?

	componentDidMount() {
		document.body.addEventListener('keydown', this.props.explicit ? onKeyboardEventTab : onKeyboardEventTabEscape);
		window.addEventListener('focus', onFocusEvent);
		window.addEventListener('pageshow', onFocusEvent);		// iOS
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', this.props.explicit ? onKeyboardEventTab : onKeyboardEventTabEscape);
		window.removeEventListener('focus', onFocusEvent);
		window.removeEventListener('pageshow', onFocusEvent);	// iOS
	}
/*
	eventFocus( e ) {
		const focusables = getFocusables();

		if ( focusables.length ) {
			if ( !focusables[document.activeElement.id] ) {
				e.preventDefault();
				focusables[0].focus();
			}
		}
	}

	/**
	 * @param {KeyboardEvent} e
	 */
	/*
	eventKey( e ) {
		// Tab
		if ( e.keyCode == 9 ) {
			var focusable = this.getFocusable();
			var active = document.activeElement.id;

			if ( focusable.length ) {
				if ( !focusable[active] ) {
					e.preventDefault();
					focusable[0].focus();
				}
				else if ( focusable[active] == focusable[focusable.length-1] && !e.shiftKey ) {
					e.preventDefault();
					focusable[0].focus();
				}
				else if ( focusable[active] == focusable[0] && e.shiftKey ) {
					e.preventDefault();
					focusable[focusable.length-1].focus();
				}
			}
		}
		// ESC key
		else if ( e.keyCode == 27 ) {
			if ( !this.props.explicit ) {
				e.preventDefault();
				closeDialog();
			}
		}
	}

*/

	render( props ) {
		const {explicit, cancel, ...otherProps} = props;

		/*
		var parent_props = {
			'id': 'dialog-background',
			'class': 'dialog-background'
		};
		if ( !props.explicit ) {
			parent_props.onClick = props.oncancel ? props.oncancel : onAbort;
		}

		var child_props = {
			'class': 'dialog-base'+(props.class ? ' '+props.class : ''),
			'onClick': onDialogClick
		};
		*/

		return (
			<div role="none" id="dialog-background" onClick={(cancel && cancel instanceof Function) ? cancel : (explicit ? undefined : closeDialog)}>
				<form role="dialog" onClick={onDialogClick} cancel {...otherProps}>
					{props.children}
				</form>
			</div>
		);
	}
}
