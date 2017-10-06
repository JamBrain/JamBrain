import { h, Component } 				from 'preact/preact';

import ButtonBase						from '../button-base/base';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import ContentMore						from 'com/content-more/more';

import DropdownNotification				from '../dropdown-notification/notification';

import NotificationsBase				from 'com/content-notifications/base';
import Notification						from 'com/content-notifications/notification';

import $Notification					from '../../shrub/js/notification/notification';


export default class NotificationsFeed extends NotificationsBase {
	constructor( props ) {
		super(props);

		this.state = {
			maxReadId: 0,
			offset: 0,
			limit: 30,
			count: 0,
			notifications: null,
			notificationIds: [],
			status: null,
			highestRead: -1,
		};
		this.fetchMore = this.fetchMore.bind(this);
	}

	componentDidMount() {

		$Notification.GetFeedAll(this.state.offset, this.state.limit ).then((r) => {
			this.processNotificationFeed(r);
		});

	}

	fetchMore() {
		const offset = this.state.offset + this.state.feedSize;
		$Notification.GetFeedAll(offset, this.state.limit ).then((r) => {
			this.processNotificationFeed(r);
		});
		this.setState({offset:offset});
	}

	render( props, state ) {

		const maxReadId = state.highestRead;
		const processing = state.status === null || this.isLoading();
		const hasMore = !processing && state.offset + state.feedSize < state.count;
		//console.log(processing, state.offset, state.feedSize, state.count);
		const hasUnread = this.getHighestNotificationInFeed() > maxReadId;
		let ShowNotifications = [];
		const caller_id = state.caller_id;
		const notifications = state.notifications;
		const notificationsOrder = this.getNotificationsOrder();
		notificationsOrder.forEach((identifier) => {
			let notification = notifications.get(identifier);
			ShowNotifications.push((
				<Notification caller_id={caller_id} notification={notification} class={cN("-item -notification",(notification.notification[0].id>maxReadId)?'-new-comment':'')} id={'notification-' + identifier} />
			));
		});

		const ShowGetMore = hasMore ? (<ContentMore onclick={this.fetchMore} />) : null;

		const ShowSetAllRead = hasUnread ? (
			<ButtonBase
				class="-button -light focusable"
				id="button-mark-read"
				onclick={(e) => {this.markReadHighest();}}>
				Mark all commentes as read
			</ButtonBase>) : null;

		const ShowSpinner = processing ? <NavSpinner /> : null;

		return (
			<div class={cN('content-base','content-common','content-notifications',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'')}>
				<div class="-headline -indent">NOTIFICATIONS</div>
				{ShowSetAllRead}
				{ShowNotifications}
				{ShowGetMore}
				{ShowSpinner}
			</div>

		);
	}

}
