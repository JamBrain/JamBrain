import { h, Component } 				from 'preact/preact';

import Notification						from 'com/content-notifications/notification';

import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';
import $Notification					from '../../shrub/js/notification/notification';

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
			highestRead: -1,
		};
	}

	markReadHighest() {
		// TODO: Triggering this should immidiately update the counter on the
		// icon in the top bar
		const highestInFeed = this.getHighestNotificationInFeed();
		if (highestInFeed !== null) {
			if (highestInFeed > this.state.highestRead) {
				$Notification.SetMarkRead(highestInFeed).then((r) => {
					if (r.status == 200) {
						this.setState({highestRead: highestInFeed});
					}
				});
			}
		}
	}

	getHighestNotificationInFeed() {
		const notificationsOrder = this.getNotificationsOrder();
		if (notificationsOrder && notificationsOrder.length > 0) {
			return notificationsOrder[0];
		}
		return null;
	}

	processNotificationFeed(r) {

		const caller_id = r.caller_id;
		this.collectAllNodesAndNodes(r.feed, caller_id);
		let highestRead = r.max_read !== undefined ? r.max_read : this.state.highestRead;
		this.setState({
			feed: r.feed,
			caller_id: caller_id,
			status: r.status,
			count: r.count,
			loading: true,
			highestRead: highestRead,
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
		let notes = [];

		feed.forEach(({id, node, note}) => {
			if (node2notes.has(node)) {
				node2notes.get(node).push(note);
			} else {
				node2notes.set(node, [note]);
			}
			if ( note ) {
				// Only fetch nonzero notes.
				notes.push(note);
			}
			notification2nodeAndNote.set(id, {node: node, note: note});
		});

		let nodesPromise = $Node.Get(nodes)
			.then((response) => {
				//console.log('[Notifications:Nodes]', response.node);
				if (response.node) {
					response.node.forEach((node) => {
						node.authors = [];
						if (node.author > 0 && users.indexOf(node.author) < 0) {
							users.push(node.author);
							node.authors.push(node.author);
						}
						if (node.meta && node.meta.author) {
							node.meta.author.forEach((author) => {
								if (author > 0 && users.indexOf(author) < 0) {
									users.push(author);
								}
								if (author > 0 && node.authors.indexOf(author) < 0) {
									node.authors.push(author);
								}
							});
						}
						nodeLookup.set(node.id, node);
					});
				}

			});

		let notesPromise = $Note.Pick(notes).then((response) => {
			//console.log('[Notifications:Notes]', response.note);
			if (response.notes) {
				response.notes.forEach((note) => {
					noteLookup.set(note.id, note);

					if (note.author > 0 && users.indexOf(note.author) < 0) {
						users.push(note.author);
					}
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

				this.composeNotifications(feed, caller_id, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup, social);
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
			} else if (node.meta && node.meta.author) {
				node.meta.author.forEach((author) => {
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
					social: social,
				};

				data.users.set(caller_id, usersLookup.get(caller_id));
				data.users.set(node.author, usersLookup.get(node.author));

				if (node.meta && node.meta.author) {
					node.meta.author.forEach((author) => {
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
			feedSize: (this.state.feedSize ? this.state.feedSize : 0) + processedNotifications.length,
		});
	}

	updateCallback() {
		//For subclass to do stuff with
	}

	isLoading() {
		return this.state.loading;
	};

	getNotificationsOrder() {
		return this.state.notificationIds;
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
