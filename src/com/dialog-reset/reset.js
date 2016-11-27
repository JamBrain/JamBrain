import { h, Component } 				from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';

import DialogBase						from 'com/dialog-base/base';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';


export default class DialogReset extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			mail: "",
			error: null,
			loading: false
		};

		// Bind functions (avoiding the need to rebind every render)
		this.onChange = this.onChange.bind(this);
		this.doReset = this.doReset.bind(this);
	}
	
	componentDidMount() {
		this.registerMail.focus();
	}

	onChange( e ) {
		this.setState({ mail: e.target.value });
	}
	
	doReset() {
		mail = this.state.mail.trim();
		
		if ( Sanitize.validateMail(mail) ) {
			this.setState({ loading: true, error: null });
			
			$User.Reset( mail )
			.then( r => {
				if ( r.status === 200 ) {
					console.log('sent', r.sent);
					this.setState({sent: true, loading: false});
				}
				else {
					console.log(r);
					this.setState({ error: r.message ? r.message : r.response, loading: false });
				}
				return r;
			})
			.catch( err => {
				console.log(err);
				this.setState({ error: err, loading: false });
			});
		}
		else {
			this.setState({ error: "Incorrectly formatted e-mail address" });
		}
	}

	render( props, {mail, sent, loading, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		var title = "Reset Password";
		
		if ( loading ) {
			return (
				<DialogBase title={title} explicit {...ErrorMessage}>
					<div>
						Please wait...
					</div>
				</DialogBase>
			);
		}
		else if ( sent ) {
			return (
				<DialogBase title={title} ok explicit {...ErrorMessage}>
					<div>
						Password reset message sent to to <code>{mail}</code>
					</div>
				</DialogBase>
			);
		}
		else {
			// NOTE: There's a Preact bug that the extra <span /> is working around
			return (
				<DialogBase title={title} ok cancel oktext="Send E-mail" explicit onclick={this.doReset} {...ErrorMessage}>
					<div>
						<input ref={(input) => this.registerMail = input} id="dialog-register-mail" onchange={this.onChange} class="-text focusable" type="text" name="email" placeholder="E-mail address" maxlength="254" /><LabelYesNo value={Sanitize.validateMail(mail) ? 1 : -1} />
					</div>
				</DialogBase>
			);
		}
	}
}
