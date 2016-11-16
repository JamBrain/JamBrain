import { h, Component } from 'preact/preact';

export default class DialogBase extends Component {
	constructor() {
		this._eventWheel = this.eventWheel.bind(this);
		this._eventKey = this.eventKey.bind(this);
	}

	componentDidMount() {
		document.body.addEventListener('mousewheel', this._eventWheel);
		document.body.addEventListener('keydown', this._eventKey);
	}
	
	componentDidUnmount() {
		console.log("HOON");
		document.body.removeEventListener('mousewheel', this._eventWheel);
		document.body.removeEventListener('keydown', this._eventKey);
	}
	
	eventWheel( e ) {
		// Disables Mouse Wheel
		if ( document.getElementById("dialog-background") ) {
			e.preventDefault();
		}
	}
	
	eventKey( e ) {
		if ( document.getElementById("dialog-background") ) {
			var keys_to_disable = [
				9, 					// Tab
				33, 34, 			// PgUp, PgDown
				35, 36,				// End, Home
				37, 38, 39, 40,		// Left, Up, Right, Down
			];
			
			if( keys_to_disable.indexOf(e.keyCode) >= 0) {
				e.preventDefault();
			}
			// ESC key
			else if ( e.keyCode == 27 ) {
				this.abort();
			}
		}
	}
	

	abort() {
		window.location.hash = "#";
	}
	
	render( props ) {
		props.onclick = function(e) {
			this.abort();
		}.bind(this);
		
		var ButtonOK = "";
		var ButtonCancel = "";
		
		if ( props.ok ) {
			ButtonOK = <div class="-button -light">{props.oktext ? props.oktext : "OK"}</div>;
		}
		if ( props.cancel ) {
			ButtonCancel = <div class="-button">{props.canceltext ? props.canceltext : "Cancel"}</div>;
		}

		return (
			<div class="dialog-background" id="dialog-background">
				<div class="dialog-base" onclick={ e => event.stopPropagation() }>
					<div class="-header">
						<div class="-title _font2">{props.title}</div>
					</div>
					<div class="-body">{props.children}</div>
					<div class="-footer">
						{ButtonOK}
						{ButtonCancel}
					</div>
				</div>
			</div>
		);
	}
}
