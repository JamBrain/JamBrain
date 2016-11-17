import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

import LabelYesNo						from 'com/label-yesno/yesno';

export default class DialogActivate extends Component {
	constructor( props ) {
		console.log("prop",props);
		this.state = {
			name: "",
			slug: "",
			password: "",
			password2: ""
		};
	}
	
	componentDidMount() {
		this.activateName.focus();
	}
	
	onNameChange( e ) {
		this.state.name = e.target.value;
		this.state.slug = this.getSlug();
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
	
	getSlug() {
		var slug = this.state.name.toLowerCase();
		
		return slug;
	}
	
	isValidName() {
		if ( this.state.name.length === 0 )
			return 0;
		if ( this.state.name.length < 3 )
			return -1;
		
		return 1;
	}
	isValidSlug() {
		if ( this.state.slug.length === 0 )
			return 0;
		if ( this.state.slug.length < 3 )
			return -1;
		
		return 1;
	}
	isValidPassword() {
		if ( this.state.password.length === 0 )
			return 0;
		if ( this.state.password.length < 8 )
			return -1;
		
		return 1;
	}
	isValidPassword2() {
		// Clever: This doesn't start failing until password (not password2) is not empty
		if ( this.state.password.length === 0 )
			return 0;
		if ( this.state.password2.length < 8 )
			return -1;
			
		if ( this.state.password !== this.state.password2 )
			return -1;
		
		return 1;
	}

	render( props ) {
		var ErrorMessage = {};//{ error:"There was a problem" };

		if ( false ) {
			return (
				<DialogBase title="Activate Account" ok explicit {...ErrorMessage}>
					This account can't be activated.
				</DialogBase>
			);
		}
		
		// NOTE: There's a Preact bug that the extra <span /> is working around
		return (
			<DialogBase title="Activate Account" ok cancel oktext="Activate" explicit {...ErrorMessage}>
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
					<span class="-label">Name:</span><input ref={(input) => this.activateName = input} id="dialog-activate-name" onchange={this.onNameChange.bind(this)} class="-text tabbable" type="text" name="username" maxlength="32" value={this.state.name} /><LabelYesNo value={this.isValidName()} />
				</div>
				<div>
					<span class="-label">Account Name:</span><span ref={(input) => this.activateSlug = input} id="dialog-activate-slug"><code>{this.state.slug}</code></span><LabelYesNo value={this.isValidSlug()} />
				</div>
				<div>
					<span class="-label">Password:</span><input ref={(input) => this.activatePassword = input} id="dialog-activate-password" onchange={this.onPasswordChange.bind(this)} class="-text tabbable" type="password" name="password" maxlength="64" value={this.state.password} /><LabelYesNo value={this.isValidPassword()} />
				</div>
				<div>
					<span class="-label">Password Again:</span><input ref={(input) => this.activatePassword2 = input} id="dialog-activate-password2" onchange={this.onPassword2Change.bind(this)} class="-text tabbable" type="password" name="password2" maxlength="64" value={this.state.password2} /><LabelYesNo value={this.isValidPassword2()} />
				</div>
			</DialogBase>
		);
	}
}

//				<div class="-info -topline">
//					Two-factor authentication can be enabled from your <strong>Account Settings</strong>.
//				</div>
