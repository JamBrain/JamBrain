import {h, Component} 				from 'preact/preact';

import ButtonBase						from '../button-base/base';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import ContentMore						from 'com/content-more/more';

import NotificationsBase				from 'com/content-notifications/base';
import Notification						from 'com/content-notifications/notification';
import NotificationsFilter				from 'com/content-notifications/filter';

import $Notification					from 'shrub/js/notification/notification';

import ContentSimple					from 'com/content-simple/simple';

export default class NotificationsFeed extends NotificationsBase {
	constructor( props ) {
		super(props);

		this.state = {
			'errorStatus': 0,
			'maxReadId': 0,
			'offset': 0,
			'limit': 30,
			'count': 0,
			'notifications': null,
			'notificationIds': [],
			'status': null,
			'highestRead': -1,
			'filters': {
				'comment': false,
				'mention': true,
				'friendGame': true,
				'friendPost': true,
				'selfComment': true,
			},
		};
		this.fetchMore = this.fetchMore.bind(this);
	}

	componentDidMount() {

		$Notification.GetFeedAll(this.state.offset, this.state.limit ).then((r) => {
			if (r.status == 200) {
				this.processNotificationFeed(r);
			}
			else {
				this.setState({'errorStatus': r.status});
			}
		});

	}

	fetchMore() {
		const offset = this.state.offset + this.state.limit;
		$Notification.GetFeedAll(offset, this.state.limit ).then((r) => {
			if (r.status == 200) {
				this.processNotificationFeed(r);
				this.setState({'offset': offset});
			}
			else {
				this.setState({'errorStatus': r.status});
			}
		});
	}

	render( props, state ) {
		const maxReadId = state.highestRead;
		const processing = state.status === null || this.isLoading();
		const hasMore = !processing && ((state.offset + this.state.limit) < state.count);
		//console.log(processing, state.offset, state.feedSize, state.count);
		const hasUnread = this.getHighestNotificationInFeed() > maxReadId;
		let ShowNotifications = [];
		const caller_id = state.caller_id;
		const notifications = state.notifications;
		const notificationsOrder = this.getNotificationsOrder();
		notificationsOrder.forEach((identifier) => {
			let notification = notifications.get(identifier);
			if (this.shouldShowNotification(notification)) {
				ShowNotifications.push((
					<Notification
						caller_id={caller_id}
						notification={notification}
						class={cN("-item -notification", (notification.notification[0].id>maxReadId)?'-new-comment':'')}
						id={'notification-' + identifier}
					/>
				));
			}
		});

		if ( ShowNotifications.length == 0 ) {
			ShowNotifications.push((
				<div>There are no notifications here. You'll get notifications when other people reply to posts you've made or commented on.</div>
			));
		}

		const ShowGetMore = hasMore ? (<ContentMore onclick={this.fetchMore} />) : null;

		const ShowSetAllRead = hasUnread ? (
			<ButtonBase
				class="-button -light focusable"
				id="button-mark-read"
				onclick={
					(e) => {
						this.markReadHighest();
					}
				}>
				Mark all notifications as read
			</ButtonBase>) : null;

		const ShowSpinner = processing ? <NavSpinner /> : null;

		const ShowError = state.errorStatus ? ( <div class="-error">Error code {state.errorStatus} while fetching notifications</div> ) : null;

		const view = (
			<div class="-notifications">
				<NotificationsFilter handleFilterChange={this.handleFilterChange} filters={state.filters} />
				{ShowSetAllRead}
				{ShowError}
				{ShowNotifications}
				{ShowGetMore}
				{ShowSpinner}
			</div>
			);

		return (
			<ContentSimple class="content-notifications" {...props} notitle nofooter nomarkup viewonly={view} header={"NOTIFICATIONS"} headerIcon="bubble" />
		);
	}

}
