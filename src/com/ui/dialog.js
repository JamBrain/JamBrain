import { Component } from 'preact';
import {ui_dialog, ui_window} from './dialog.module.less';

function handleKeys( e ) {
	// ESC key
	if ( e.keyCode == 27 ) {
		e.preventDefault();
		e.target.onCancel();
	}
}

function onCancel( e ) {
	if ( e.target.onCancel && !e.target.explicit ) {
		e.target.onCancel();
	}
}

function onClickWindow( e ) {
	e.stopPropagation();
}

export class Dialog extends Component {
/*
	constructor( props ) {
		super(props);

		this.onKey = this.onKey.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onClickWindow = this.onClickWindow.bind(this);
	}
*/

	componentDidMount() {
		document.body.addEventListener('keydown', handleKeys);
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', handleKeys);
	}
/*
	componentDidMount() {
		document.body.addEventListener('keydown', this.onKey);
	}

	componentWillUnmount() {
		document.body.removeEventListener('keydown', this.onKey);
	}

	onCancel( e ) {
		if ( this.props.oncancel && !this.props.explicit )
			this.props.oncancel();
	}

	// Stop window from closing on click
	onClickWindow( e ) {
		e.stopPropagation();
	}

	onKey( e ) {
		// ESC key
		if ( e.keyCode == 27 ) {
			e.preventDefault();
			this.onCancel();
		}
	}
*/

	render( props ) {
		const {'class': classProp, ...otherProps} = props;

		return <section class={`${ui_dialog} ${classProp ?? ''}`} onClick={onCancel}>
			<aside class={ui_window} onClick={onClickWindow} />
		</section>;
	}
}
