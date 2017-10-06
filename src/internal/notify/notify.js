export default {
	init,
	send
};

// Do this when logged in //
export function init() {
	if ( "Notification" in window ) {
		return window.Notification.requestPermission();
	}
}

// Send a notification. Will do nothing if no permissions given. //
export function send( title, body, icon ) {
	if ( "Notification" in window ) {
		let options = {};
		if ( body )
			options['body'] = body;
		if ( icon )
			options['icon'] = icon;
		return new window.Notification( title, options );
	}
}
