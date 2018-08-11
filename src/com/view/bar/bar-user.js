import {h, Component} 					from 'preact/preact';
//import Shallow			 				from 'shallow/shallow';

import UIIcon							from 'com/ui/icon/icon';
import UIImage							from 'com/ui/image/image';
import UIButton							from 'com/ui/button/button';
import UIDropdown						from 'com/ui/dropdown/dropdown';

import $User							from 'shrub/js/user/user';

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
				<UIImage src={UserAvatar} block />
				<UIButton href={UserURL}><UIIcon>user</UIIcon><span>My Profile</span></UIButton>
				<UIButton href={UserURL+'games'}><UIIcon>gamepad</UIIcon><span>My Games</span></UIButton>
				<div class="-gap" />
				<UIButton onclick={this.onLogout}><UIIcon>logout</UIIcon><span>Logout</span></UIButton>
			</UIDropdown>
		);
	}
}
