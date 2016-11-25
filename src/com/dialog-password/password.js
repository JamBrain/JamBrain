import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

import $User							from '../shrub/js/user/user';

export default class DialogPassword extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			password: "",
			password2: ""
		};

		// Bind functions (avoiding the need to rebind every render)
		this.doResetPassword = this.doResetPassword.bind(this);
	}
	
	componentDidMount() {
//		this.loginName.focus();
	}

	onPasswordChange( e ) {
		this.setState({ password: e.target.value });
	}
	
	doResetPassword() {
//		$User.Password( this.state.login.trim(), this.state.password.trim(), "" )
//			.then( r => {
//				if ( r.status === 200 ) {
//					console.log('success',r);
//					location.href = "#";//user-loggedin";
//					this.props.onlogin();
//				}
//				else {
//					console.log(r);
//					this.setState({ error: r.message ? r.message : r.response });
//				}
//				return r;
//			})
//			.catch( err => {
//				console.log(err);
//				this.setState({ error: err });
//			});
	}

	render( props, {login, password, remember, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		
		if ( false ) {
			
		}
		else {
			return (
				<DialogBase title="Reset Password" ok cancel oktext="Save" onclick={this.doResetPassword} {...ErrorMessage}>
					<div>
						<input onchange={this.onPasswordChange} class="-text focusable" type="password" name="password" placeholder="Password" maxlength="128" value={password} />
					</div>
				</DialogBase>
			);
		}
	}
}
