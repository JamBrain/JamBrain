import { h, Component } 				from 'preact/preact';
import ButtonBase						from 'com/button-base/base';

export default class DialogBase extends Component {
	constructor( props ) {
		this._eventWheel = this.eventWheel.bind(this);
		this._eventKey = this.eventKey.bind(this);
//		this._eventFocus = this.eventFocus.bind(this);
	}
	
	getTabbable() {
		return document.getElementsByClassName("tabbable");
	}

	componentDidMount() {
		console.log("DialogBase: componentDidMount");
		document.body.addEventListener('mousewheel', this._eventWheel);
		document.body.addEventListener('keydown', this._eventKey);
//		window.addEventListener('focus', this._eventFocus);
	}
	
	componentDidUnmount() {
		console.log("DialogBase: componentDidUnmount");
		document.body.removeEventListener('mousewheel', this._eventWheel);
		document.body.removeEventListener('keydown', this._eventKey);
//		window.removeEventListener('focus', this._eventFocus);
	}
	
	eventWheel( e ) {
		// Disables Mouse Wheel
		if ( document.getElementById("dialog-background") ) {
			e.preventDefault();
		}
	}
	
	eventFocus( e ) {
		if ( document.getElementById("dialog-background") ) {
			var tabbable = this.getTabbable();
			
			if ( !tabbable[document.activeElement.id] ) {
				e.preventDefault();
				tabbable[0].focus();					
			}
		}
	}
	
	eventKey( e ) {
		var el = document.getElementById("dialog-background");
		
		if ( el ) {
			var keys_to_disable = [
				33, 34, 			// PgUp, PgDown
				35, 36,				// End, Home
				37, 38, 39, 40,		// Left, Up, Right, Down
			];
			
			// Keys Above
			if( keys_to_disable.indexOf(e.keyCode) >= 0) {
				e.preventDefault();
			}
			// Tab
			else if ( e.keyCode == 9 ) {
				var tabbable = this.getTabbable();
				var active = document.activeElement.id;
				
				if ( !tabbable[active] ) {
					e.preventDefault();
					tabbable[0].focus();					
				}
				else if ( tabbable[active] == tabbable[tabbable.length-1] && !e.shiftKey ) {
					e.preventDefault();
					tabbable[0].focus();
				}
				else if ( tabbable[active] == tabbable[0] && e.shiftKey ) {
					e.preventDefault();
					tabbable[tabbable.length-1].focus();
				}			
			}
			// ESC key
			else if ( e.keyCode == 27 ) {
				if ( !el.hasAttribute("explicit") ) {
					this.abort();
				}
			}
		}
	}
	

	abort() {
		window.location.hash = "#";
	}
	
	render( props ) {
		var _Abort = { onclick: e => { this.abort(); }};
		var Abort = props.explicit ? { explicit:true } : _Abort;
		var Error = props.error ? (<div class="-error"><strong>Error:</strong> {props.error}</div>) : "";
		
		var ShowButtonOK = "";
		var ShowButtonCancel = "";
		
		if ( props.ok ) {
			let Click = props.onclick ? { onclick: props.onclick } : (props.cancel ? {} : _Abort);
			ShowButtonOK = <ButtonBase class="-button -light tabbable" id="dialog-button-ok" ref={(input) => this.buttonOK = input} {...Click}>{props.oktext ? props.oktext : "OK"}</ButtonBase>;
		}
		if ( props.cancel ) {
			let Click = props.oncancel ? { onclick: props.oncancel } : _Abort;
			ShowButtonCancel = <ButtonBase class="-button tabbable" id="dialog-button-cancel" ref={(input) => this.buttonCancel = input} {...Click}>{props.canceltext ? props.canceltext : "Cancel"}</ButtonBase>;
		}

		return (
			<div class="dialog-background" id="dialog-background" {...Abort}>
				<div class="dialog-base" onclick={ e => {e.preventDefault(); e.stopPropagation(); } }>
					<div class="-header">
						<div class="-title _font2">{props.title}</div>
					</div>
					{Error}
					<div class="-body">{props.children}</div>
					<div class="-footer">
						{ShowButtonOK}
						{ShowButtonCancel}
					</div>
				</div>
			</div>
		);
	}
}
