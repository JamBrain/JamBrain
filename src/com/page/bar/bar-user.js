import './bar-user.less';
import {IconButton, Image, UIDropdown} from 'com/ui';

import $User from 'backend/js/user/user';

function onLogout() {
	$User.Logout()
	.then(r => {
		window.location.reload();
	});
}

export default function PageBarUser( props ) {
	const {user, ...otherProps} = props;

	// Bail if we don't have a valid user
	if ( !user )
		return null;

	// Construct avatar details
	const userURL = `/users/${user.slug}/`;
	const hasAvatar = user.meta && user.meta.avatar;
	const userAvatar = hasAvatar ? `//${STATIC_DOMAIN}${user.meta.avatar}.40x40.fit.png` : `//${STATIC_DOMAIN}/other/dummy/user64.png`;

	return (
		<UIDropdown class="-user" right>
			<Image alt="Your Profile" src={userAvatar} block />
			<IconButton icon="user" href={userURL}>My Profile</IconButton>
			<IconButton icon="gamepad" href={userURL+'games'}>My Games</IconButton>
			<div class="-gap" />
			<IconButton icon="logout" onClick={onLogout}>Logout</IconButton>
		</UIDropdown>
	);
}
