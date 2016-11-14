import { h, Component } from 'preact/preact';

export default class DialogOverlay extends Component {
	constructor() {
		this.state = {};
	}

	componentDidMount() {
		// Disables Mouse Wheel //
		document.body.addEventListener('mousewheel', function(e) {
			if ( document.getElementById("dialog-overlay") ) {
				e.preventDefault();
			    //return false;
			}
		}.bind(this), false);

		document.body.addEventListener('keydown', function(e) {
			if ( document.getElementById("dialog-overlay") ) {
				var keys_to_disable = [
					9, 					// Tab
					33, 34, 			// PgUp, PgDown
					35, 36,				// End, Home
					37, 38, 39, 40,		// Left, Up, Right, Down
				];
				
				if( keys_to_disable.indexOf(e.keyCode) >= 0) {
					e.preventDefault();
					//return false;
				}
				// ESC key
				else if ( e.keyCode == 27 ) {
					this.abort();
				}
			}
			//return true;
		}.bind(this), false);
	}
	
	abort() {
		//location.href = location.pathname+location.search;//"#";
		//history.pushState(history.state, null, location.pathname+location.search);
		
		//this.dispatchNavChangeEvent(this.state);		
		window.location.hash = "#";
	}
	
	render( props ) {
		props.id = "dialog-overlay";
		props.class = "dialog-overlay effect-fadein" + (props.class ? (" " + props.class) : "");
			
		props.onclick = function(e) {
			this.abort();
		}.bind(this);
		
		return (
			<div {...props} />
		);
	}
}
