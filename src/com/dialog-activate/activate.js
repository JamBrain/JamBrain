import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogActivate extends Component {
	constructor() {
	}
	
	componentDidUpdate() {
		this.activateName.focus();
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Activate Account" ok cancel oktext="Activate" explicit {...Error}>
				<div class="-info">
					Enter your desired User Name and Password.
				</div>
				<div>
					<span /><span class="-label">E-mail:</span><span ref={(input) => this.activateMail = input}>bobby@bobby.bob</span>
				</div>
				<div>
					<span class="-label">User Name:</span><input ref={(input) => this.activateName = input} class="-text" type="text" name="username" />
				</div>
				<div>
					<span class="-label">Internal:</span><span ref={(input) => this.activateSlug = input}>you-rock</span>
				</div>
				<div>
					<span class="-label">Password:</span><input ref={(input) => this.activatePassword = input} class="-text" type="password" name="password" />
				</div>
				<div>
					<span class="-label">Again:</span><input ref={(input) => this.activatePassword2 = input} class="-text" type="password" name="password2" />
				</div>
			</DialogBase>
		);
	}
}
