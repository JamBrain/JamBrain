import './bar-user.less';
import {ButtonIcon, Image, Dropdown} from 'com/ui';

import $User from 'backend/js/user/user';

function onLogout() {
	$User.Logout()
	.then(r => {
		window.location.reload();
	});
}

export function PageBarUser( props ) {
	const {user, ...otherProps} = props;

	// Bail if we don't have a valid user
	if ( !user )
		return null;

	// Construct avatar details
	const userURL = `/users/${user.slug}/`;
	const hasAvatar = user.meta && user.meta.avatar;
	const userAvatar = hasAvatar ? `//${STATIC_DOMAIN}${user.meta.avatar}.40x40.fit.png` : `//${STATIC_DOMAIN}/other/dummy/user64.png`;

	// MK TODO: -user shouldn't have a dash
	return (
		<Dropdown class="-user" right>
			{/* MK TODO: this Image used block. Was it necessary? Should it use '-center'? */}
			<Image alt="Your Profile" src={userAvatar} />
			<ButtonIcon icon="user" href={userURL}>My Profile</ButtonIcon>
			<ButtonIcon icon="gamepad" href={userURL+'games'}>My Games</ButtonIcon>
			<div class="-gap" />
			<ButtonIcon icon="logout" onClick={onLogout}>Logout</ButtonIcon>
		</Dropdown>
	);
}
