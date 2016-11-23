import { h, Component } 				from 'preact/preact';
import DialogBase						from 'com/dialog-base/base';

import LabelYesNo						from 'com/label-yesno/yesno';

import $User							from '../shrub/js/user/user';


function getHTTPVars() {
	var ret = {};
	
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
	        ret[nv[0]] = nv[1] || true;
	    }
	}
	
	return ret;
}

export default class DialogActivate extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			loading: true
		};

		var Vars = getHTTPVars();
		console.log("v",Vars);
		
		// Get activation ID
		this.ActID = Vars.id;
		this.ActHash = Vars.key;
		
		// Lookup ID, and confirm this is a valid activation
		$User.Activate( this.ActID, this.ActHash, "", "" )
			.then( r => {
				if ( r.status === 200  ) {
					this.setState({
						mail: r.mail,
						name: "",
						slug: "",
						password: "",
						password2: "",
						loading: false
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
		this.setState({ name: e.target.value, slug: this.toSlug(e.target.value) });
	}
	onPasswordChange( e ) {
		this.setState({ password: e.target.value });
	}
	onPassword2Change( e ) {
		this.setState({ password2: e.target.value });
	}
	
	toSlug( str ) {
		var slug = str.toLowerCase();
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

	doActivate() {
		$User.Activate( this.ActID, this.ActHash, this.state.name, this.state.password )
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

	doFinishActivation() {
		// HACK
		location.href = "?alpha";
	}
	
	render( props, {mail, name, slug, password, password2, created, loading, error} ) {
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
					<span class="-label">Account Name:</span><span id="dialog-activate-slug"><code>{slug}</code></span><LabelYesNo value={this.isValidSlug()} />
				</div>
				<div>
					<span class="-label">Password:</span><input id="dialog-activate-password" onchange={this.onPasswordChange} class="-text focusable" type="password" name="password" maxlength="64" value={password} /><LabelYesNo value={this.isValidPassword()} />
				</div>
				<div>
					<span class="-label">Password Again:</span><input id="dialog-activate-password2" onchange={this.onPassword2Change} class="-text focusable" type="password" name="password2" maxlength="64" placeholder="Confirmation" value={password2} /><LabelYesNo value={this.isValidPassword2()} />
				</div>
				
				<div class="-info -topline">
					<strong>Account Names</strong> are generated automatically from your <strong>Name</strong>. An <strong>Account Name</strong> is the name used in your personalized URLs, and your <strong>@name</strong>.
				</div>
				<div class="-info">
					<strong>Names</strong> let you customize how your <strong>Account Name</strong> looks. You can use case, accents, and simple punctuation. <strong>Account Names</strong> are more strict. <strong>Names</strong> will be converted to <strong>Account Names</strong> by using only lower case letters, numbers, and single dashes.
				</div>
			</DialogBase>
		);
	}
}
