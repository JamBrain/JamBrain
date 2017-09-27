import { h, Component } 				from 'preact/preact';

import Notification						from 'com/content-notifications/notification';

export default class NotificationsBase extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			notifications: [],
			notificationsTotal: -1,
			status: null,
		};
	}
	
	processNotificationFeed(r) {
		const caller_id = r.caller_id;							
		let notifications = [];
		r.feed.forEach((notification) => {
			notifications.push(
				[notification.id, <Notification failCallback={ (id) => this.failCallback(id) } caller_id={caller_id} notification={notification} markReadyCallback={(id) => this.markReady(id) } />, false]);					
		});	
		
		this.setState({
			status: r.status,
			notifications: notifications,
			notificationsTotal: r.feed.length + this.state.notifications.length,
		});
	}
	
	removeFailed(id) {
		let notifications = this.state.notifications.filter(([cur_id, notification, loaded]) => cur_id != id);
		this.updateCallback();
		this.setState({notifications: notifications});		
	}
	
	markReady(id) {
		console.log('Mark ready', id);
		let notifications = [...this.state.notifications];
		for (let i=0; i<notifications.length; i++) {
			if (notifications[i][0] == id) {
				notifications[i][2] = true;
			}
		}
		this.updateCallback();
		this.setState({notifications: notifications});
		
		if (this.props.getNew && !this.isLoading()) {
			let maxId = -1;
			
			notifications.forEach(([id, notification, loaded]) => {
				if (id > maxId) {
					maxId = id;
				}
			});
			
			if (id >= 0){
				$Notification.SetMarkRead(maxId);
			}
			if (this.props.countCallback) {
				this.props.countCallback(notifications.length);
			}
		}
	}

	updateCallback() {
		//For subclass to do stuff with
	}
	
	isLoading() {
		let loading = this.state.notificationsTotal < 0;
		this.state.notifications.forEach(([id, notification, loaded]) => {
			if (!loaded) {
				loading = true;
				console.log('Loading', id, loaded);
			}
		});
		console.log('Loading', loading);
		return loading;
	};
		
	getNotifications() {
		let Notifications = [];
		const feed = this.state.notifications;
		
		if (feed && feed.length > 0) {
			
			feed.forEach(([id, notification, loaded]) => {
				if (true) {
					Notifications.push([id, notification]);
					console.log('Render', id, notification);
				}
			});

		}
		
		return Notifications;
	}

}