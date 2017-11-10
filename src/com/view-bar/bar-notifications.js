import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import ButtonLink						from '../button-link/link';

import NotificationsBase				from 'com/content-notifications/base';
import Dropdown							from 'com/input-dropdown/dropdown';

import $Notification					from '../../shrub/js/notification/notification';

export default class DropdownNotification extends NotificationsBase {

	componentDidMount() {
		const showCount = 8;
		$Notification.GetFeedAll(0, showCount ).then((r) => {
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
		let ShowSpinner = null;
		let Notifications = [];

		if (state.status === null) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			Notifications = [[null, (<div>An error occurred retrieving the notifications...</div>)]];
		} else {
			if (loading) {
				ShowSpinner = (<NavSpinner />);
			}
			Notifications = this.getNotifications();
		}

		if (ShowSpinner !== null) {
			Notifications.push([null, ShowSpinner]);
		}

		if ( !loading && this.hasUnreadNotifications() ) {
			Notifications.push([-2, (<ButtonLink onclick={ e => { this.clearNotifications(); } } ><em>Mark all as read</em></ButtonLink>)]);
		}

		Notifications.push([-1, (<ButtonLink onclick={ e => { this.hide(); } } href='/home/notifications'><em>Open notifications feed...</em></ButtonLink>)]);

		return (
			<Dropdown class='-notifications' items={Notifications} startExpanded={true} hideSelectedField={true} />
		);
	}
}
