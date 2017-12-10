import {h, Component} 					from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import ButtonLink						from 'com/button-link/link';

import NotificationsBase				from 'com/content-notifications/base';
import Dropdown							from 'com/input-dropdown/dropdown';

import $Notification					from 'shrub/js/notification/notification';

export default class DropdownNotification extends NotificationsBase {

	componentDidMount() {
		const showCount = 24;
		$Notification.GetFeedAllFiltered(0, showCount ).then((r) => {
			this.processNotificationFeed(r);
		}).catch((e)=> console.log('[Notification error]', e));
	}

	hide() {
		if (this.props.hideCallback) {
			this.props.hideCallback();
		}
	}

	clearNotifications() {
		this.markReadHighest();
		if (this.props.clearCallback) {
			this.props.clearCallback();
		}
	}

	render( props ) {
		const state = this.state;
		const loading = this.isLoading();
		const showMax = 8;
		let ShowSpinner = null;
		let Notifications = [];

		if (state.status === null) {
			ShowSpinner = (<NavSpinner />);
		}
		else if (state.status != 200) {
			Notifications = [[null, (<div>An error occurred retrieving the notifications...</div>)]];
		}
		else {
			if (loading) {
				ShowSpinner = (<NavSpinner />);
			}
			Notifications = this.getNotifications(showMax);
		}

		if (ShowSpinner !== null) {
			Notifications.push([null, ShowSpinner]);
		}

		if ( !loading && (state.count == 0) ) {
			Notifications.push([-3, (<div>You have no notifications.</div>)]);
		}

		if ( !loading && this.hasUnreadNotifications() ) {
			Notifications.push([-2, (<ButtonLink onclick={ e => { this.clearNotifications(); } } ><em>Mark all as read</em></ButtonLink>)]);
		}

		Notifications.push([-1, (<ButtonLink onclick={ e => { this.hide(); } } href="/my/notifications"><em>Open notifications feed...</em></ButtonLink>)]);

		return (
			<Dropdown class="-notifications" items={Notifications} startExpanded={true} hideSelectedField={true} />
		);
	}
}
