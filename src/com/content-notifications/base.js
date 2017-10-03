import { h, Component } 				from 'preact/preact';

import Notification						from 'com/content-notifications/notification';

import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class NotificationsBase extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			notifications: null,
			notificationIds: [],
			notificationsTotal: -1,
			count: 0,
			status: null,
			feed: [],
			loading: true,
		};
	}
	
	processNotificationFeed(r) {
		
		const caller_id = r.caller_id;							
		/*
		let notifications = [];
		r.feed.forEach((notification) => {
			notifications.push(
				[notification.id, <Notification failCallback={ (id) => this.failCallback(id) } caller_id={caller_id} notification={notification} markReadyCallback={(id) => this.markReady(id) } />, false, notification]);					
		});	
		*/
		this.collectAllNodesAndNodes(r.feed, caller_id);
		
		this.setState({
			feed: r.feed,
			caller_id: caller_id,
			status: r.status,
			count: r.count,
			loading: true,
			//notifications: notifications,
			//notificationsTotal: r.feed.length + this.state.notifications.length,
		});
	}
	
	collectAllNodesAndNodes(feed, caller_id) {
		
		let nodeLookup = new Map();
		let nodes = [];
		let notificationLookup = new Map();
		let social = {};
		
		let soicialPromise = $Node.GetMy().then((response) => {
			
			social.following = response.star ? response.star : [];
			social.followers = response.refs.star ? response.refs.star : [];
			social.friends = social.followers.filter((i) => social.following.indexOf(i) > -1);
		});
		
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
						node.authors = [];
						if (node.author && users.indexOf(node.author) >= 0) {
							users.push(node.author);
							
							node.authors.push(node.author);
						}
						if (node.link && node.link.author) {
							node.link.author.forEach((author) => {
								if (users.indexOf(author) < 0) {
									users.push(author);
								}
								if (node.authors.indexOf(author) < 0) {
									node.authors.push(author);
								}
							});
						}
						nodeLookup.set(node.id, node);
					});
				}
				
			});
			
		let notesPromise = $Note.Pick(node2notes).then((response) => {
			console.log('[Notifications:Notes]', response.note);
			if (response.note) {
				response.note.forEach((notes, node) => {
					notes.forEach((note) => {
						noteLookup.set(note.id, note);
						
						if (note.author && users.indexOf(note.author) < 0) {
							users.push(note.author);
						}							
					});
				});
			}	
		});
		
		Promise.all([nodesPromise, notesPromise, soicialPromise])
			.then(() => { 
				noteLookup.forEach((note, id) => {
					note.isNodeAuthor = nodeLookup.get(note.node).authors.indexOf(note.author) > -1;
				});
				return $Node.Get(users);
			})			
			.then((response) => {
				//console.log('[Notifications:Users]', response.node);
				if (response.node) {
					response.node.forEach((node) => {
						if (node.type == 'user') {
							node.isFriend = social.friends.indexOf(node.id) > -1;
							node.isFollowing = node.isFriend && social.following.indexOf(node.id) > -1;
							node.isFollower = node.isFriend && social.followers.indexOf(node.id) > -1;
							
							usersLookup.set(node.id, node);
						}
					});
				}
				
				this.composeNotifications(feed, caller_id, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup);
			});
	}
	
	composeNotifications(feed, caller_id, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup, social) {
		
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
		
		let notifications = this.state.notifications ? this.state.notifications : new Map();
		let notificationIds = this.state.notificationIds;
		
		let processedNotifications = [];
		
		feed.forEach((notification) => {
			if (processedNotifications.indexOf(notification.id) < 0) {
				let node = nodeLookup.get(notification.node);
				let data = {
					node: node,
					note: undefined,
					notification: [notification],
					multi: false,
					users: new Map(),
				};
				
				data.users.set(caller_id, usersLookup.get(caller_id));
				data.users.set(node.author, usersLookup.get(node.author));
				
				if (node.link && node.link.author) {
					node.link.author.forEach((author) => {
						if (!data.users.has(author)) {
							data.users.set(author, usersLookup.get(author));
						}
					});
				}
				
				if (notification.note) {
					let firstNote = noteLookup.get(notification.note); 
					data.note = [firstNote];
					if (!data.users.has(firstNote.author)) {
						data.users.set(firstNote.author, firstNote);
					}
					
					if (!firstNote.mention && !firstNote.selfauthored && !firstNote.isNodeAuthor) {
						node2notes.get(notification.node).forEach((note) => {
							if (note != notification.note) {
								let noteData = noteLookup.get(note);
								if (!noteData.mention && !noteData.selfauthored && !noteData.isNodeAuthor) {
									notification2nodeAndNote.forEach((otherData, otherNotification) => {
										if (otherData.note == note) {
											processedNotifications.push(otherNotification);
											data.notification.push(notificationLookup.get(otherNotification));
											data.note.push(noteData);
											if (!data.users.has(noteData.author)) {
												data.users.set(noteData.author, noteData);
											}
											data.multi = true;
										}
									});
								}
							}
						});
					}
				}
				let notificationId = data.notification.sort()[0].id;
				notificationIds.push(notificationId);
				notifications.set(notificationId, data);			
				processedNotifications.push(notification.id);
			}
		});
		
		this.setState({
			notifications: notifications,
			notificationIds: notificationIds.sort((a, b) => b - a),
			loading: false,
		});
	}
	
	/*
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
	*/
	
	updateCallback() {
		//For subclass to do stuff with
	}
	
	isLoading() {
		/*
		let loading = this.state.notificationsTotal < 0;
		this.state.notifications.forEach(([id, notification, loaded, notificationData]) => {
			if (!loaded) {
				loading = true;
			}
		});
		return loading;*/
		return this.state.loading;
	};
		
	getNotificationsOrder() {
		return this.state.notificationIds;
		/*
		if (this.state.notifications) {
			console.log(this.state.notifications, [...this.state.notifications], [...this.state.notifications].map(([key, val]) => key), [...this.state.notifications].map(([key, val]) => key).sort((a, b) => b - a));
			return [...this.state.notifications].map(([key, val]) => key).sort((a, b) => b - a);
		} else {
			return []; 
		}*/
	}
	
	getNotifications() {
		let Notifications = [];
		const notifications = this.state.notifications;
		const notificationsOrder = this.getNotificationsOrder();
		const caller_id = this.state.caller_id;
		if (!this.state.loading) {
			
			notificationsOrder.forEach((id) => {
				let notification = notifications.get(id);
				Notifications.push([id, <Notification caller_id={caller_id} notification={notification} />]);
			});

		}
		
		return Notifications;
	}

}