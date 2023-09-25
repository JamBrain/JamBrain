import { Component } from 'preact';
import DialogCommon						from 'com/dialog/common/common';

/** @deprecated */
export default class DialogPromise extends Component {
	constructor(props) {
		super(props);

		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onConfirm() {
		this.props.resolve(true);
		this.base.remove();
	}

	onCancel() {
		this.props.resolve(false);
		this.base.remove();
	}

	render(props) {
		return (
			<DialogCommon ok={this.onConfirm} cancel={this.onCancel} {...props}>
				{props.children}
			</DialogCommon>
		);
	}
}
