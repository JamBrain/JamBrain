import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

export default class DialogActivate extends Component {
	constructor( props ) {
		console.log("prop",props);
		this.state = {
			name: "",
			password: "",
			password2: ""
		};
	}
	
	componentDidMount() {
		this.activateName.focus();
	}
	
	onNameChange( e ) {
		this.state.name = e.target.value;
		this.setState(this.state);
	}
	
	onPasswordChange( e ) {
		this.state.password = e.target.value;
		this.setState(this.state);
	}
	onPassword2Change( e ) {
		this.state.password2 = e.target.value;
		this.setState(this.state);
	}

	render( props ) {
		var Error = {};//{ error:"There was a problem" };
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Activate Account" ok cancel oktext="Activate" explicit {...Error}>
				<div class="-info">
					<strong>Account Names</strong> are generated automatically from your <strong>Name</strong>. An <strong>Account Name</strong> is the name used in your personalized URLs, and your <strong>@name</strong>.
				</div>
				<div class="-info -botline">
					<strong>Names</strong> let you customize how your <strong>Account Name</strong> looks. You can use case, accents, and simple punctuation. <strong>Account Names</strong> are more strict. <strong>Names</strong> will be converted to <strong>Account Names</strong> by using only lower case letters, numbers, and single dashes.
				</div>
				<div>
					<span /><span class="-label">E-mail:</span><span ref={(input) => this.activateMail = input} id="dialog-activate-mail">bobby@bobby.bob</span>
				</div>
				<div>
					<span class="-label">Name:</span><input ref={(input) => this.activateName = input} id="dialog-activate-name" onchange={this.onNameChange.bind(this)} class="-text tabbable" type="text" name="username" value={this.state.name} />
				</div>
				<div>
					<span class="-label">Account Name:</span><span ref={(input) => this.activateSlug = input} id="dialog-activate-slug">{this.state.name}</span>
				</div>
				<div>
					<span class="-label">Password:</span><input ref={(input) => this.activatePassword = input} id="dialog-activate-password" onchange={this.onPasswordChange.bind(this)} class="-text tabbable" type="password" name="password" value={this.state.password} />
				</div>
				<div>
					<span class="-label">Password Again:</span><input ref={(input) => this.activatePassword2 = input} id="dialog-activate-password2" onchange={this.onPassword2Change.bind(this)} class="-text tabbable" type="password" name="password2" value={this.state.password2} />
				</div>
			</DialogBase>
		);
	}
}

//				<div class="-info -topline">
//					Two-factor authentication can be enabled from your <strong>Account Settings</strong>.
//				</div>
