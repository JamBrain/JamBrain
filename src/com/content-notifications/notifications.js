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
			offset: 0,
			limit: 20,
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
	}
	
	getFormattedNotifications() {
		let Notifications = [];
		this.getNotifications().forEach(([id, notification]) => {
			Notifications.push((
				<div class={"-item -notification -indent-"+1}>
					{notification}
				</div>
			));
		});
	}
	
	render( props, state ) {
		
		const processing = state.status === null || this.isLoading();
		const ShowNotifications = this.getFormattedNotifications();
		
		let ShowGetMore = processing ? null : (
			<div class={"-item -notification -indent-"+1}>
				<NavLink onclick={(e)=> console.log('MOAR')}>MORE...</NavLink>
			</div>
			);
			
		let ShowSetAllRead = processing ? null : (
			<div class={"-item -notification -indent-"+1}>
				<NavLink onclick={ (e) => console.log('Read') }>Mark all commentes as read</NavLink>
			</div>
			);
		const ShowSpinner = processing ? <NavSpinner /> : null;

		return (
			<div class={['content-base','content-common',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class={"-item -indent-0"}>
					<div class="-headline">NOTIFICATIONS</div>
					{ShowSetAllRead}
					{ShowNotifications}
					{ShowGetMore}
					{ShowSpinner}
				</div>
			</div>

		);
	}
	
}