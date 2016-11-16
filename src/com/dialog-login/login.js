import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogLogin extends Component {
	constructor() {
	}

	componentDidMount() {
	}
	
	render( props ) {
		return (
			<DialogBase title="Log In" ok cancel oktext="Log In">
				<div>Name:</div>
				<div>Password:</div>
				<div>[x] Remember</div>
				<div>Forgot Login/Password?</div>
			</DialogBase>
		);
	}
}
