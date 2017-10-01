import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';

import DropdownNotification				from '../dropdown-notification/notification';

import NotificationsBase				from 'com/content-notifications/base';

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
			notifications: [],
			notificationsTotal: -1,
			status: null,
		};
		
	}
	
	componentDidMount() {
		const showCount = 30;

		$Notification.GetFeedAll(this.state.offset, showCount ).then((r) => {
			this.processNotificationFeed(r);
		});
		
		$Notification.GetCountAll().then((r) => {
			this.setState({existingNotifications: r.count});
		});
		
		$Notification.GetCountUnread().then((r) => {
			this.setState({unreadNotifications: r.count});
		});
	}
	
	getFormattedNotifications() {
		const maxReadId = this.state.unreadNotifications;
		let Notifications = [];
		const notifications = this.getNotifications();
		
		notifications.forEach(([id, notification], index) => {
			console.log('Notification', id, notification);
			Notifications.push((
				<div class={["-item -notification",index<maxReadId?'-new-comment':'']}>
					{notification}
				</div>
			));
		});
		
		return Notifications;
	}
	
	render( props, state ) {
		
		const processing = state.status === null || this.isLoading();
		const hasMore = !processing && state.offset + state.count < state.existingNotifications;
		const ShowNotifications = this.getFormattedNotifications();
		
		const ShowGetMore = hasMore ? (
			<div class={"-item -notification -indent -action"}>
				<NavLink onclick={(e)=> console.log('MOAR')} href="#">MORE...</NavLink>
			</div>
			) : null;
			
		const ShowSetAllRead = processing ? null : (
			<div class={"-item -notification -indent -action"}>
				<NavLink onclick={ (e) => console.log('Read') } href="#">Mark all commentes as read</NavLink>
			</div>
			);
			
		const ShowSpinner = processing ? <NavSpinner /> : null;

		return (
			<div class={['content-base','content-common','content-notifications',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline -indent">NOTIFICATIONS</div>
				{ShowSetAllRead}
				{ShowNotifications}
				{ShowGetMore}
				{ShowSpinner}

			</div>

		);
	}
	
}