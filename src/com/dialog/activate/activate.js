import {h, Component} 					from 'preact/preact';
import Sanitize							from 'internal/sanitize/sanitize';

import DialogCommon						from 'com/dialog/common/common';
import NavSpinner						from 'com/nav-spinner/spinner';
import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from 'shrub/js/user/user';

export default class DialogActivate extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'loading': true
		};

		var Vars = Sanitize.getHTTPVars();
		console.log("v",Vars);

		// Get activation ID
		this.ActID = Vars.id;
		this.ActHash = Vars.key;


		// Bind functions (avoiding the need to rebind every render)
		this.onNameChange = this.onNameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPassword2Change = this.onPassword2Change.bind(this);
		this.doActivate = this.doActivate.bind(this);
		this.doFinishActivation = this.doFinishActivation.bind(this);
	}

	componentDidMount() {
		// Lookup ID, and confirm this is a valid activation
		$User.Activate(this.ActID, this.ActHash.trim(), "", "")
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
			}
			else {
				console.log(r);
				this.setState({ 'error': r.response, 'loading': false });
			}
		})
		.catch( err => {
			console.log(err);
			this.setState({ 'error': err, 'loading': false });
		});
	}

	onNameChange( e ) {
		var name = e.target.value.trim();
		var slug = Sanitize.makeSlug(name);

		$User.Have( name, this.state.mail )
		.then( r => {
			if ( r.status === 200 ) {
				this.setState({ valid_slug: (r.available && slug !== "" ? 1 : -1) });
			}
			else {
				//console.log(r);
				this.setState({ 'error': r.message ? r.message : r.response, 'loading': false });
			}
			return r;
		})
		.catch( err => {
			//console.log(err);
			this.setState({ 'error': err, 'loading': false });
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
			this.setState({'loading': true});

			$User.Activate( this.ActID, this.ActHash.trim(), this.state.name.trim(), this.state.password.trim() )
			.then( r => {
				if ( r.status === 201 ) {
					//console.log('success',r);
					//location.href = "#user-activated";
					this.setState({ 'created': true, 'loading': false, 'error': null });
				}
				else {
					//console.log(r);
					this.setState({ 'error': r.message ? r.message : r.response, 'loading': false });
				}
				return r;
			})
			.catch( err => {
				//console.log(err);
				this.setState({ 'error': err, 'loading': false });
			});
		}
		else {
			this.setState({ error: "Form incomplete or invalid" });
		}
	}

	doFinishActivation() {
		// HACK (no search string, so to hide querystring)
		window.location.href = window.location.pathname;//+window.location.search;
	}

	render( props, {mail, name, slug, password, password2, valid_slug, created, loading, error} ) {
		var new_props = {
			'title': 'Create Account: Step 2'
		};
		if ( error ) {
			new_props.error = error;
		}

		if ( loading ) {
			return (
				<DialogCommon empty explicit {...new_props}>
					<NavSpinner />
				</DialogCommon>
			);
		}
		else if ( !mail ) {
			return (
				<DialogCommon ok explicit {...new_props}>
					{"This account can't be activated."}
				</DialogCommon>
			);
		}

		if ( created ) {
			return (
				<DialogCommon ok onok={this.doFinishActivation} explicit {...new_props}>
					Account <code>{this.slug}</code> Created. You can now <strong>Log In</strong>.
				</DialogCommon>
			);
		}

		return (
			<DialogCommon ok oktext="Create Account" onok={this.doActivate} cancel oncancel={this.doFinishActivation} explicit {...new_props}>
				<div>
					<span class="-label">E-mail:</span>
					<div class="-input-container">
						<span id="dialog-activate-mail">{mail}</span>
					</div>
				</div>
				<div>
					<span class="-label">Name:</span>
					<div class="-input-container">
						<input autofocus id="dialog-activate-name" onchange={this.onNameChange} class="-text focusable" type="text" name="username" maxlength="32" placeholder="How your name appears" value={name} />
						<LabelYesNo value={this.isValidName()} />
					</div>
				</div>
				<div>
					<span class="-label">Account Name:</span>
					<div class="-input-container">
						<span id="dialog-activate-slug">
							<code>{slug}</code>
						</span>
						<LabelYesNo value={valid_slug} />
					</div>
				</div>
				<div>
					<span class="-label">Password:</span>
					<div class="-input-container">
						<input id="dialog-activate-password" oninput={this.onPasswordChange} class="-text focusable" type="password" name="password" maxlength="128" value={password} />
						<LabelYesNo value={this.isValidPassword()} />
					</div>
				</div>
				<div>
					<span class="-label">Password Again:</span>
					<div class="-input-container">
						<input id="dialog-activate-password2" oninput={this.onPassword2Change} class="-text focusable" type="password" name="password2" maxlength="128" placeholder="Confirmation" value={password2} />
						<LabelYesNo value={this.isValidPassword2()} />
					</div>
				</div>

				<div class="-info -topline if-dialog-not-small-block">
					<strong>Account Names</strong> are generated automatically from your <strong>Name</strong>. An <strong>Account Name</strong> is the name used in your personalized URLs, and your <strong>@name</strong>.
				</div>
				<div class="-info if-dialog-not-small-block">
					<strong>Names</strong> let you customize how your <strong>Account Name</strong> looks. You can use case, accents, and simple punctuation. <strong>Account Names</strong> are more strict. <strong>Names</strong> will be converted to <strong>Account Names</strong> by using only lower case letters, numbers, and single dashes.
				</div>
			</DialogCommon>
		);
	}
}
