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
		this.collectAllNodesAndNodes(r.feed, caller_id);
	}
	
	collectAllNodesAndNodes(feed, caller_id) {
		//promise.all
		let nodeLookup = new Map();
		let nodes = [];
		let notificationLookup = new Map();
		
		feed.forEach((notification) => {
			if (nodes.indexOf(notification.node) < 0) {
				nodes.push(notification.node);
			}
			notificationLookup.set(notification.id, notification);
		});
		
		let node2notes = new Map();
		let notification2nodeAndNote = new Map();
		let noteLookup = new Map();
		let users = [];
		let usersLookup = new Map();
		
		users.push(caller_id);
		
		feed.forEach(({id, node, note}) => {
			if (node2notes.has(node)) {
				node2notes.get(node).push(note);
			} else {
				node2notes.set(node, [note]);
				
			}
			notification2nodeAndNote.set(id, {node: node, note: note});
		});
		
		let nodesPromise = $Node.Get(nodes)
			.then((response) => {
				console.log('[Notifications:Nodes]', response.node);
				if (response.node) {
					response.node.forEach((node) => {
						nodeLookup.set(node.id, node);
						if (node.author && users.indexOf(node.author) >= 0) {
							users.push(node.author);
						}
						if (node.link && node.link.author) {
							node.link.author.forEach((author) => {
								if (users.indexOf(author) >= 0) {
									users.push(author);
								}
							});
						}
					});
				}
				
			});
		let notesPromise = $Note.Get(nodes).then((response) => {
			console.log('[Notifications:Notes]', response.note);
			if (response.note) {
				response.note.forEach((note) => {
					//Only keep notes we are interested in
					if (node2notes.get(note.node).indexOf(note.id) >= 0) {
						noteLookup.set(note.id, note);
						
						if (note.author && users.indexOf(note.author) >= 0) {
							users.push(note.author);
						}							
					}
				});
			}	
		});
		Promise.all(nodesPromise, notesPromise).then(() => { return $Node.Get(users);}).then((response) => {
				console.log('[Notifications:Users]', response.node);
				if (response.node) {
					response.node.forEach((node) => {
						if (node.type == 'user') {
							usersLookup.set(node.id, node);
						}
					});
				}
				this.composeNotifications(feed, caller_id, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup);
			});
	}
	
	composeNotifications(feed, caller_id, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup) {
		
		const myAtName = '@' + usersLookup.get(caller_id).name;
		noteLookup.forEach((note, id) => {
			note.selfauthored = note.author == caller_id;
			note.mention = note.body.indexOf(myAtName) >= 0;
		});
		
		nodeLookup.forEach((node, id) => {
			node.selfauthored = false;
			if (node.author == caller_id) {
				node.selfauthored = true;
			} else if (node.link && node.link.author) {
				node.link.author.forEach((author) => {
					if (author == caller_id) {
						node.selfauthored = true;
					}
				});
			}
			node.mention = node.body.indexOf(myAtName) >= 0 || node.name.indexOf(myAtName) >= 0;
		});
		
		let notifications = [];
		let processedNotifications = [];
		
		feed.forEach((notification) => {
			if (processedNotifications.indexOf(notification.id) < 0) {
				
				let data = {
					notifications: [],
					node: nodeLookup.get(notification.node),
					note: undefined,
					notification: [notification],
					multi: false
				};
				
				if (notification.note) {
					let firstNote = noteLookup.get(notification.note); 
					data.note = [firstNote];
					
					if (!firstNote.mention && !firstNote.selfauthored) {
						node2notes.get(notification.node).forEach((note) => {
							if (note != notification.note) {
								let noteData = noteLookup.get(note);
								if (!noteData.mention && !noteData.selfauthored) {
									notification2nodeAndNote.forEach((otherData, otherNotification) => {
										if (otherData.note == note) {
											processedNotifications.push(otherNotification);
											data.notification.push(notificationLookup.get(otherNotification));
										}
									});
									data.note.push(noteData);
									data.multi = true;
								}
							}
						});
					}
				}
				notifications.push(data);			
				processedNotifications.push(notification.id);
			}
		});
		console.log(notifications);
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