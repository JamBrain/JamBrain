import {h, Component} 					from 'preact/preact';
//import Shallow			 				from 'shallow/shallow';

import UIImage							from 'com/ui/image/image';
import UIButton							from 'com/ui/button/button';

export default class ViewBarUser extends Component {
	constructor( props ) {
		super(props);
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
			UserAvatar = '//'+STATIC_DOMAIN+user.meta.avatar;

		return (
			<UIButton class="-user" href={UserURL}>
				<UIImage src={UserAvatar} />
			</UIButton>
		);
	}
}
