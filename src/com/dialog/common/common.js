import { Component } from 'preact';
import './common.less';

import DialogBase from 'com/dialog/base/base';
import {Button, navigateToLocalURL} from 'com/ui';


function closeDialog() {
	navigateToLocalURL('?a=');
}


export default class DialogCommon extends Component {
/*
	constructor( props ) {
		super(props);

//		this._eventWheel = this.eventWheel.bind(this);
//		this._eventKey = this.eventKey.bind(this);
////		this._eventFocus = this.eventFocus.bind(this);

		this.onAbort = this.onAbort.bind(this);
	}

//	getFocusable() {
//		return document.getElementsByClassName("focusable");
//	}
//
//	componentDidMount() {
////		console.log("DialogBase: componentDidMount");
//		document.body.addEventListener('mousewheel', this._eventWheel);
//		document.body.addEventListener('keydown', this._eventKey);
////		window.addEventListener('focus', this._eventFocus);
//	}
//
//	componentWillUnmount() {
////		console.log("DialogBase: componentWillUnmount");
//		document.body.removeEventListener('mousewheel', this._eventWheel);
//		document.body.removeEventListener('keydown', this._eventKey);
////		window.removeEventListener('focus', this._eventFocus);
//	}
//
//	eventWheel( e ) {
//		// Disables Mouse Wheel
//		if ( document.getElementById("dialog-background") ) {
//			e.preventDefault();
//		}
//	}

//	eventFocus( e ) {
//		if ( document.getElementById("dialog-background") ) {
//			var focusable = this.getFocusable();
//
//			if ( !focusable[document.activeElement.id] ) {
//				e.preventDefault();
//				focusable[0].focus();
//			}
//		}
//	}

//	eventKey( e ) {
//		var el = document.getElementById("dialog-background");
//
//		if ( el ) {
//			// TODO: Spacebar needs to be ignored, but only if not in an input box
//
//			var keys_to_disable = [
//				33, 34, 			// PgUp, PgDown
//				35, 36,				// End, Home
//				37, 38, 39, 40,		// Left, Up, Right, Down
//			];
//
//			// Keys Above
//			if( keys_to_disable.indexOf(e.keyCode) >= 0) {
//				e.preventDefault();
//			}
//			// Tab
//			else if ( e.keyCode == 9 ) {
//				var focusable = this.getFocusable();
//				var active = document.activeElement.id;
//
//				if ( !focusable[active] ) {
//					e.preventDefault();
//					focusable[0].focus();
//				}
//				else if ( focusable[active] == focusable[focusable.length-1] && !e.shiftKey ) {
//					e.preventDefault();
//					focusable[0].focus();
//				}
//				else if ( focusable[active] == focusable[0] && e.shiftKey ) {
//					e.preventDefault();
//					focusable[focusable.length-1].focus();
//				}
//			}
//			// ESC key
//			else if ( e.keyCode == 27 ) {
//				if ( !el.hasAttribute("explicit") ) {
//					this.abort();
//				}
//			}
//		}
//	}

	onAbort() {
		navigateToLocalURL('?a=');
	}
*/
	render( props ) {
		const {
			'class': classProp,
			ok,
			okText = "OK",
			cancel,
			cancelText = "Cancel",
			error,
			children,
			...otherProps
		} = props;

		const okFunc = (ok && ok instanceof Function) ? ok : closeDialog;
		const cancelFunc = (cancel && cancel instanceof Function) ? cancel : closeDialog;

		/*
		var new_props = {
			'class': "dialog-common" + (props.class ? ' '+props.class : ''),
			'oncancel': props.oncancel ? props.oncancel : onDialogCancel
		};
		if ( props.explicit ) {
			new_props.explicit = props.explicit;
		}

		var ShowError = null;
		if ( props.error ) {
			ShowError = <div class="error"><strong>Error:</strong> {error}</div>;
		}

		var ShowButtonOK = null;
		if ( props.ok ) {
			let Click = props.onok ? { 'onClick': props.onok } : (props.cancel ? {} : { 'onClick': closeDialog });
			ShowButtonOK = <Button class="-button -light focusable" id="dialog-button-ok" {...Click}>
				{props.oktext ? props.oktext : "OK"}
			</Button>;
		}

		var ShowButtonCancel = null;
		if ( props.cancel ) {
			let Click = props.oncancel ? { 'onClick': props.oncancel } : { 'onClick': closeDialog };
			ShowButtonCancel = <Button class="-button focusable" id="dialog-button-cancel" {...Click}>
				{props.canceltext ? props.canceltext : "Cancel"}
			</Button>;
		}

		if ( props.empty ) {
			return (
				<DialogBase {...otherProps}>
					{props.children}
				</DialogBase>
			);
		}
*/

		return (
			<DialogBase class={`dialog-common ${classProp ?? ''}`} {...otherProps}>
				<header class="_font2">{props.title}</header>
				{error ? <div class="error"><strong>Error:</strong> {error}</div> : null}
				<div class="body">
					{children}
				</div>
				<footer>
					{ok ? <Button class="lit focusable" onClick={okFunc}>{okText}</Button> : null}
					{cancel ? <Button class="focusable" onClick={cancelFunc}>{cancelText}</Button> : null}
				</footer>
			</DialogBase>
		);
	}
}
