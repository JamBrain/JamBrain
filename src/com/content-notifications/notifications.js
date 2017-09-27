import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

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
		const showCount = 8;

		$Notification.GetFeedAll(this.state.offset, showCount ).then((r) => {
			this.processNotificationFeed(r);
		});
	}
	
	render( props, state ) {
		
		const processing = state.status === null || this.isLoading();
		const ShowNotifications = this.getNotifications();
		let ShowGetMore = processing ? null : (<div>MORE</div>);
		let ShowSetAllRead = procesing ? null : (<div>Mark all commentes as read</div>);
		const ShowSpinner = processing ? <NavSpinner /> : null;

		return (
			<div class={['content-base','content-common',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline">NOTIFICATIONS</div>
				{ShowSetAllRead}
				{ShowNotifications}
				{ShowGetMore}
				{ShowSpinner}
				<div class="content-footer content-footer-common -footer" style="height:0" />
			</div>

		);
	}
	
}