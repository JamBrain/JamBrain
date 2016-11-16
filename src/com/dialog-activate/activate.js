import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogActivate extends Component {
	constructor() {
	}
	
	componentDidUpdate() {
		document.getElementById('dialog-register-mail').focus();
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		return (
			<DialogBase title="Activate Account" ok cancel oktext="Activate" {...Error}>
				<div class="-info">
					Enter your desired User Name and Password.
				</div>
				<div>
					<span class="-label">E-mail:</span><span id="dialog-activate-mail">bobby@bobby.bob</span>
				</div>
				<div>
					<span class="-label">User Name:</span><input id="dialog-activate-name" class="-text" type="text" name="username" />
				</div>
				<div>
					<span class="-label">Internal:</span><span id="dialog-activate-slug">you-rock</span>
				</div>
				<div>
					<span class="-label">Password:</span><input id="dialog-activate-password" class="-text" type="password" name="password" />
				</div>
				<div>
					<span class="-label">Again:</span><input id="dialog-activate-password2" class="-text" type="password" name="password2" />
				</div>
			</DialogBase>
		);
	}
}
