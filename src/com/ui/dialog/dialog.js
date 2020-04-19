import {h, Component} 					from 'preact/preact';

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
			<div class="ui-dialog" onclick={this.onCancel}>
				<div {...props} class={cN('-window', props.class)} onclick={this.onClickWindow} />
			</div>
		);
	}
}
