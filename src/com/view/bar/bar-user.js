import { Component } 					from 'preact';
import './bar-user.less';

import {Button, Image, Icon, UIDropdown} from 'com/ui';

import $User							from 'backend/js/user/user';

export default class ViewBarUser extends Component {
	constructor( props ) {
		super(props);

		this.onLogout = this.onLogout.bind(this);
	}


	onLogout() {
		$User.Logout()
		.then(r => {
			location.reload();
		});
	}

	render( props ) {
		let {user} = props;

		// Bail if we don't have a valid user
		if ( !user )
			return null;

		// Construct avatar details
		let UserURL = '/users/'+user.slug+'/';
		let UserAvatar = '//'+STATIC_DOMAIN+'/other/dummy/user64.png';
		if ( user.meta && user.meta.avatar )
			UserAvatar = '//'+STATIC_DOMAIN+user.meta.avatar+".40x40.fit.png";

		return (
			<UIDropdown class="-user" right>
				<Image alt="Your Profile" src={UserAvatar} block />
				<Button href={UserURL}><Icon>user</Icon><span>My Profile</span></Button>
				<Button href={UserURL+'games'}><Icon>gamepad</Icon><span>My Games</span></Button>
				<div class="-gap" />
				<Button onClick={this.onLogout}><Icon>logout</Icon><span>Logout</span></Button>
			</UIDropdown>
		);
	}
}
