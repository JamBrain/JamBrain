import Notifications from 'com/content-notifications/notifications';

export default function ViewHome( props ) {
	let ShowContent = null;
	if ( Array.isArray(props.show) && props.show[0] == 'notifications' ) {
		ShowContent = <Notifications />;
	}

	return (
		<div id="content">
			{ShowContent}
		</div>
	);
}

