import {h, Component} 					from 'preact/preact';

export default class DialogBase extends Component {
	constructor( props ) {
		super(props);

		this.eventKey = this.eventKey.bind(this);
		this.eventFocus = this.eventFocus.bind(this);

		this.onAbort = this.onAbort.bind(this);
		this.onDialogClick = this.onDialogClick.bind(this);
	}

	componentDidMount() {
		document.body.addEventListener('keydown', this.eventKey);
		window.addEventListener('focus', this.eventFocus);
		window.addEventListener('pageshow', this.eventFocus);		// iOS
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', this.eventKey);
		window.removeEventListener('focus', this.eventFocus);
		window.removeEventListener('pageshow', this.eventFocus);	// iOS
	}

	getFocusable() {
		return document.getElementsByClassName("focusable");
	}

	eventFocus( e ) {
		var focusable = this.getFocusable();

		if ( focusable.length ) {
			if ( !focusable[document.activeElement.id] ) {
				e.preventDefault();
				focusable[0].focus();
			}
		}
	}

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
				this.onAbort();
			}
		}
	}


	onAbort() {
		window.location.hash = "--";
		//location.href = location.pathname+location.search;
	}

	onDialogClick( e ) {
		e.preventDefault();
		e.stopPropagation();
	}

	render( props ) {
		var parent_props = {
			'id': 'dialog-background',
			'class': 'dialog-background'
		};
		if ( !props.explicit ) {
			parent_props.onclick = props.oncancel ? props.oncancel : this.onAbort;
		}

		var child_props = {
			'class': 'dialog-base'+(props.class ? ' '+props.class : ''),
			'onclick': this.onDialogClick
		};

		return (
			<div {...parent_props}>
				<div {...child_props}>
					{props.children}
				</div>
			</div>
		);
	}
}
