import { h, Component } 				from 'preact/preact';
import Sanitize							from '../../internal/sanitize/sanitize';
import DialogBase						from 'com/dialog-base/base';

import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';



export default class DialogActivate extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			loading: true
		};

		var Vars = Sanitize.getHTTPVars();
		console.log("v",Vars);

		// Get activation ID
		this.ActID = Vars.id;
		this.ActHash = Vars.key;

		// Lookup ID, and confirm this is a valid activation
		$User.Activate( this.ActID, this.ActHash.trim(), "", "" )
			.then( r => {
				if ( r.status === 200 ) {
					var name = (r.slug && r.slug.length ? r.slug[0] : "");
					var slug = Sanitize.makeSlug(name);

					this.setState({
						'mail': r.mail,
						'name': name,
						'slug': slug,
						'password': "",
						'password2': "",

						'valid_slug': 0,
						'loading': false
					});
//					this.activateName.focus();
				}
				else {
					console.log(r);
					this.setState({ error: r.response, loading: false });
				}
			})
			.catch( err => {
				console.log(err);
				this.setState({ error: err, loading: false });
			});

		// Bind functions (avoiding the need to rebind every render)
		this.onNameChange = this.onNameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPassword2Change = this.onPassword2Change.bind(this);
		this.doActivate = this.doActivate.bind(this);
		this.doFinishActivation = this.doFinishActivation.bind(this);
	}

	componentDidMount() {
//		if ( this.activateName )
//			this.activateName.focus();
	}

	onNameChange( e ) {
		var name = e.target.value.trim();
		var slug = Sanitize.makeSlug(name);

		$User.Have( name, this.state.mail )
		.then( r => {
			if ( r.status === 200 ) {
				this.setState({ valid_slug: (r.available ? 1 : -1) });
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

		this.setState({ name: name, slug: slug, valid_slug: 0, error: null });
	}
	onPasswordChange( e ) {
		this.setState({ password: e.target.value, error: null });
	}
	onPassword2Change( e ) {
		this.setState({ password2: e.target.value, error: null });
	}


	isValidName() {
		var str = this.state.name.trim();
		if ( str.length === 0 )
			return 0;
		if ( str.length < 3 )
			return -1;

		return 1;
	}
	isValidSlug() {
		var str = this.state.slug.trim();
		if ( str.length === 0 )
			return 0;
		if ( str.length < 3 )
			return -1;

		return 1;
	}
	isValidPassword() {
		var pw = this.state.password.trim();
		if ( pw.length === 0 )
			return 0;
		if ( pw.length < 8 )
			return -1;

		return 1;
	}
	isValidPassword2() {
		var pw1 = this.state.password.trim();
		var pw2 = this.state.password2.trim();
		// Clever: This doesn't start failing until password (not password2) is not empty
		if ( pw1.length === 0 )
			return 0;
		if ( pw2.length < 8 )
			return -1;

		if ( pw1 !== pw2 )
			return -1;

		// Keep this check, so the display doesn't look weird
		if ( this.state.password !== this.state.password2 )
			return -1;

		return 1;
	}

	doActivate() {
		if ( this.isValidName() > 0 && this.isValidPassword() > 0 && this.isValidPassword2() > 0 ) {
			$User.Activate( this.ActID, this.ActHash.trim(), this.state.name.trim(), this.state.password.trim() )
			.then( r => {
				if ( r.status === 201 ) {
					console.log('success',r);
					//location.href = "#user-activated";
					this.setState({ created: true, loading: false, error: null });
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
			this.setState({ error: "Form incomplete or invalid" });
		}
	}

	doFinishActivation() {
		// HACK
		location.href = "?";//"?alpha";
	}

	render( props, {mail, name, slug, password, password2, valid_slug, created, loading, error} ) {
		var ErrorMessage = error ? {'error': error} : {};
		var title = "Create Account: Step 2";

		if ( loading ) {
			return (
				<DialogBase title={title} explicit {...ErrorMessage}>
					<div>
						Please wait...
					</div>
				</DialogBase>
			);
		}
		else if ( !mail ) {
			return (
				<DialogBase title={title} ok explicit {...ErrorMessage}>
					{"This account can't be activated."}
				</DialogBase>
			);
		}

		if ( created ) {
			return (
				<DialogBase title={title} ok onclick={this.doFinishActivation} explicit {...ErrorMessage}>
					Account <code>{this.slug}</code> Created. You can now <strong>Log In</strong>.
				</DialogBase>
			);
		}

		// NOTE: There's a Preact (?) bug that the extra <span /> is working around
		return (
			<DialogBase title={title} ok cancel oktext="Create Account" onclick={this.doActivate} oncancel={this.doFinishActivation} explicit {...ErrorMessage}>
				<div>
					<span /><span class="-label">E-mail:</span><span id="dialog-activate-mail">{mail}</span>
				</div>
				<div>
					<span class="-label">Name:</span><input ref={(input) => this.activateName = input} id="dialog-activate-name" onchange={this.onNameChange} class="-text focusable" type="text" name="username" maxlength="32" placeholder="How your name appears" value={name} /><LabelYesNo value={this.isValidName()} />
				</div>
				<div>
					<span class="-label">Account Name:</span><span id="dialog-activate-slug"><code>{slug}</code></span><LabelYesNo value={valid_slug} />
				</div>
				<div>
					<span class="-label">Password:</span><input id="dialog-activate-password" oninput={this.onPasswordChange} class="-text focusable" type="password" name="password" maxlength="128" value={password} /><LabelYesNo value={this.isValidPassword()} />
				</div>
				<div>
					<span class="-label">Password Again:</span><input id="dialog-activate-password2" oninput={this.onPassword2Change} class="-text focusable" type="password" name="password2" maxlength="128" placeholder="Confirmation" value={password2} /><LabelYesNo value={this.isValidPassword2()} />
				</div>

				<div class="-info -topline if-dialog-not-small-block">
					<strong>Account Names</strong> are generated automatically from your <strong>Name</strong>. An <strong>Account Name</strong> is the name used in your personalized URLs, and your <strong>@name</strong>.
				</div>
				<div class="-info if-dialog-not-small-block">
					<strong>Names</strong> let you customize how your <strong>Account Name</strong> looks. You can use case, accents, and simple punctuation. <strong>Account Names</strong> are more strict. <strong>Names</strong> will be converted to <strong>Account Names</strong> by using only lower case letters, numbers, and single dashes.
				</div>
			</DialogBase>
		);
	}
}
