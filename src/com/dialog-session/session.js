import { h, Component } 				from 'preact/preact';
import DialogCommon						from 'com/dialog-common/common';

export default class DialogSession extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
	}

	onClick(e) {
		location.href = location.pathname+location.search;
	}

	render( props, {} ) {
		return (
			<DialogCommon title="Session Expired" ok explicit onok={this.onClick}>
				<div><strong>{"Oops!!"}</strong></div>
				<div>{"It looks like your session expired (and yes, it's probably a bug)."}</div>
				<div>{"Log in again to continue what you were doing."}</div>
			</DialogCommon>
		);
	}
}
