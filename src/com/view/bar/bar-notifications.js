import {h, Component} 					from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import ButtonLink						from 'com/button-link/link';

import NotificationsBase				from 'com/content-notifications/base';
import Dropdown							from 'com/input-dropdown/dropdown';

import $Notification					from 'shrub/js/notification/notification';

export default class DropdownNotification extends NotificationsBase {

	constructor( props ) {
		super(props);

		this.state = {
			"notifications": null,
			"notificationIds": [],
			"notificationsTotal": -1,
			"count": 0,
			"status": null,
			"feed": [],
			"loading": true,
			"highestRead": -1,
		};
		this.hide = this.hide.bind(this);
		this.clearNotifications = this.clearNotifications.bind(this);
	}

	componentDidMount() {
		this.processNotificationFeed(this.props.feed);
		if (this.props.anythingToMark) this.markReadHighest();
	}

	hasNewNotification(feed) {
		if (!feed) return false;
		const oldFeed = this.props.feed && this.props.feed.feed;
		if (!oldFeed) return true;
		return !oldFeed.map((e, i) => e == feed[i])
				.concat(feed.map((e, i) => e == oldFeed[i]))
				.reduce((a, b) => a && b);
	}

	componentWillReceiveProps(nextProps) {
		if (this.hasNewNotification(nextProps.feed && nextProps.feed.feed)) {
			this.clearNotifications();
			this.processNotificationFeed(nextProps.feed);
			if (nextProps.anythingToMark) this.markReadHighest();
		}
	}

	hide() {
		if (this.props.hideCallback) {
			this.props.hideCallback();
		}
	}

	clearNotifications() {
		if (this.props.clearCallback) {
			this.props.clearCallback();
		}
	}

	render( props, state ) {
		const showMax = 8;
		let Notifications = [];

		if (props.error) {
			Notifications = [[null, <div class="-warning">Error: {props.error}</div>]];
		}
		else if (state.status != 200) {
			Notifications = [[null, (<div class="-warning">An error occurred retrieving the notifications...</div>)]];
		}
		else {
			if (state.loading) {
				Notifications = [[null, <div class="-warning">Loading...</div>]];
			}
			Notifications = Notifications.concat(this.getNotifications(showMax, props.hideCallback));
		}

		if ( !state.loading && (state.count == 0) ) {
			Notifications.push([null, <div class="-warning">You have no notifications.</div>]);
		}

		Notifications.push([-1, (<ButtonLink onclick={this.hide} href="/my/notifications"><em>Open notifications feed...</em></ButtonLink>)]);

		return (
			<Dropdown class="-notifications" items={Notifications} expanded={true} hideSelectedField={true} onhide={this.hide} />
		);
	}
}
