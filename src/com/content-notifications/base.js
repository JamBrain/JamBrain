import { h, Component } 				from 'preact/preact';

import Notification						from 'com/content-notifications/notification';

import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class NotificationsBase extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			notifications: [],
			notificationsTotal: -1,
			count: 0,
			status: null,
			feed: [],
		};
	}
	
	processNotificationFeed(r) {
		const caller_id = r.caller_id;							
		let notifications = [];
		r.feed.forEach((notification) => {
			notifications.push(
				[notification.id, <Notification failCallback={ (id) => this.failCallback(id) } caller_id={caller_id} notification={notification} markReadyCallback={(id) => this.markReady(id) } />, false, notification]);					
		});	
		
		this.setState({
			feed: r.feed,
			caller_id: caller_id,
			status: r.status,
			count: r.count,
			notifications: notifications,
			notificationsTotal: r.feed.length + this.state.notifications.length,
		});
		this.collectAllNodesAndNodes(r.feed);
	}
	
	collectAllNodesAndNodes(feed) {
		let nodeLookup = new Map();
		let nodes = [];
		feed.forEach(({node}) => {
			if (nodes.indexOf(node) < 0) {
				nodes.push(node);
			}
		});
		
		let node2notes = new Map();
		let notification2nodeAndNote = new Map();
		let noteLookup = new Map();
		
		feed.forEach(({id, node, note}) => {
			if (feed.has(node)) {
				node2notes.set(node, [note]);
			} else {
				node2notes.get(node).push(note);
			}
			notification2nodeAndNote.set(id, {node: node, note: note});
		});
		
		$Node.Get(nodes)
			.then((response) => {
				if (response.node) {
					response.node.forEach((node) => {
						nodeLookup.set(node.id, node);
					});
				}
				
				return $Note.Get(nodes);
			})
			.then((response) => {
				if (response.note) {
					response.note.forEach((note) => {
						noteLookup.set(note.id, note);
					});
				}
				console.log(noteLookup, nodeLookup, node2notes, notification2nodeAndNote);
			});
	}
	
	removeFailed(id) {
		let notifications = this.state.notifications.filter(([cur_id, notification, loaded, notificationData]) => cur_id != id);
		this.updateCallback();
		this.setState({notifications: notifications});		
	}
	
	markReady(id) {
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
			
			notifications.forEach(([id, notification, loaded, notificationData]) => {
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
		this.state.notifications.forEach(([id, notification, loaded, notificationData]) => {
			if (!loaded) {
				loading = true;
			}
		});
		return loading;
	};
		
	getNotifications() {
		let Notifications = [];
		const feed = this.state.notifications;
		const caller_id = this.state.caller_id;
		
		if (feed && feed.length > 0) {
			
			feed.forEach(([id, notification, loaded, notificationData]) => {
				if (true) {
					Notifications.push([id, notification]);
				}
			});

		}
		
		return Notifications;
	}

}