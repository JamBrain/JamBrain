import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';

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
			limit: 20,
			count: 0,
			existingNotifications: 0,
			unreadNotifications: 0,
			notifications: null,
			notificationIds: [],
			status: null,
		};
		
	}
	
	componentDidMount() {
		console.log('[NotificationsFeed:Mounted]');
		const showCount = 30;

		$Notification.GetFeedAll(this.state.offset, showCount ).then((r) => {
			this.processNotificationFeed(r);
		});
		
		$Notification.GetCountAll().then((r2) => {
			this.setState({existingNotifications: r2.count});
		});
		
	}
	
	render( props, state ) {
		
		const maxReadId = this.state.highestRead;
		const processing = state.status === null || this.isLoading();
		const hasMore = !processing && state.offset + state.count < state.existingNotifications;
		const hasUnread = this.getHighestNotificationInFeed() > state.highestRead;
		let ShowNotifications = [];
		const caller_id = state.caller_id;
		const notifications = state.notifications;
		const notificationsOrder = this.getNotificationsOrder();
		if (!this.state.loading) {
			
			notificationsOrder.forEach((identifier) => {
				let notification = notifications.get(identifier);
				ShowNotifications.push((
					<Notification caller_id={caller_id} notification={notification} class={cN("-item -notification",(notification.notification[0].id<maxReadId)?'-new-comment':'')} id={'notification-' + identifier} />
				));
			});

		}
				
		const ShowGetMore = hasMore ? (
			<div class={"-item -notification -indent -action"}>
				<NavLink onclick={(e)=> console.log('MOAR')} href="#">MORE...</NavLink>
			</div>
			) : null;
			
		const ShowSetAllRead = hasUnread ? (
			<div class={"-item -notification -indent -action"}>
				<NavLink onclick={ (e) => console.log('Read') } href="#">Mark all commentes as read</NavLink>
			</div>
			) : null;
			
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