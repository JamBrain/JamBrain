import { Component } from 'preact';
import './dialog.less';
import cN from 'classnames';

export default class UIDialog extends Component {
	constructor( props ) {
		super(props);

		this.onKey = this.onKey.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onClickWindow = this.onClickWindow.bind(this);
	}

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


	render( props ) {
		return (
			<section class="ui-dialog" onClick={this.onCancel}>
				<aside {...props} class={cN('window', props.class)} onClick={this.onClickWindow} />
			</section>
		);
	}
}
