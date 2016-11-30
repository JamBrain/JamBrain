import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

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
			<DialogBase title="Session Expired" ok explicit onclick={this.onClick}>
				<div><strong>{"Oops!!"}</strong></div>
				<div>{"It looks like your session expired (and yes, it's probably a bug)."}</div>
				<div>{"Log in again to continue what you were doing."}</div>
			</DialogBase>
		);
	}
}
