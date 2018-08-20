import {h, Component} 					from 'preact/preact';

import Notification, {
	isNotificationComment,
	isNotificationFeedback,
	isNotificationFriendGame,
	isNotificationFriendPost,
	isNotificationMention,
	isNotificationOther
}										from 'com/content-notifications/notification';

import $Node							from 'shrub/js/node/node';
import $Comment							from 'shrub/js/comment/comment';
import $Notification					from 'shrub/js/notification/notification';

export default class NotificationsBase extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'notifications': null,
			'notificationIds': [],
			'notificationsTotal': -1,
			'count': 0,
			'status': null,
			'feed': [],
			'filtered': null,
			'loading': true,
			'highestRead': -1,
		};
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	clearNotifications() {
		this.setState({
			'notifications': null,
			'notificationIds': [],
			'notificationsTotal': -1,
			'count': 0,
			'status': null,
			'feed': [],
			'filtered': null,
			'loading': true,
			'highestRead': -1,
		});
	}

	hasUnreadNotifications() {
		const highestInFeed = this.getHighestNotificationInFeed();
		if ( highestInFeed !== null ) {
			if ( highestInFeed > this.state.highestRead ) {
				return true;
			}
		}
		return false;
	}

	markReadHighest() {
		if ( this.hasUnreadNotifications() ) {
			const highestInFeed = this.getHighestNotificationInFeed();
			$Notification.SetMarkRead(highestInFeed).then((r) => {
				if ( r.status == 200 ) {
					this.setState({'highestRead': highestInFeed});
				}
			});
			if (this.props.clearCallback) this.props.clearCallback();
		}
	}

	getHighestNotificationInFeed() {
		const notificationsOrder = this.getNotificationsOrder();
		const {feed} = this.state;
		let highestFiltered = -1;
		if ( feed ) {
			for ( let i = 0; i < feed.length; i++ ) {
				const nid = feed[i].id;
				if ( nid > highestFiltered ) {
					highestFiltered = nid;
				}
			}
		}
		if ( notificationsOrder && (notificationsOrder.length > 0) ) {
			return Math.max(notificationsOrder[0], highestFiltered);
		}
		else if ( highestFiltered > -1 ) {
			return highestFiltered;
		}
		return null;
	}

	processNotificationFeed( r ) {
		if (r == null) {
			this.setState({
				'feed': [],
				'filtered': [],
				'count': 0,
				'status': 200,
				'loading': false,
				'highestRead': 0,
			});
			return;
		}
		this.setState({'loading': true});
		const callerID = r.caller_id;
		this.collectAllNodesAndNodes(r.feed, callerID);
		let highestRead = (r.max_read !== undefined) ? r.max_read : this.state.highestRead;
		this.setState({
			'feed': r.feed,
			'filtered': r.filtered,
			'status': r.status,
			'count': r.count,
			'highestRead': highestRead,
		});
	}

	collectAllNodesAndNodes( feed, callerID ) {
		let nodeLookup = new Map();
		let nodes = [];
		let notificationLookup = new Map();
		let social = {};

		let soicialPromise = $Node.GetMy().then((response) => {
			social.following = response.meta.star ? response.meta.star : [];
			social.followers = response.refs.star ? response.refs.star : [];
			social.friends = social.followers.filter((i) => social.following.indexOf(i) > -1);
		});

		feed.forEach((notification) => {
			if ( nodes.indexOf(notification.node) < 0 ) {
				nodes.push(notification.node);
			}
			notificationLookup.set(notification.id, notification);
		});

		let node2notes = new Map();
		let notification2nodeAndNote = new Map();
		let noteLookup = new Map();
		let users = [];
		let usersLookup = new Map();

		users.push(callerID);
		let notes = [];

		feed.forEach(({id, node, note}) => {
			if ( note ) {
				// Only fetch nonzero notes. Don't add zero notes to the list of notes in a node
				if ( node2notes.has(node) ) {
					node2notes.get(node).push(note);
				}
				else {
					node2notes.set(node, [note]);
				}
				notes.push(note);
				notification2nodeAndNote.set(id, {'node': node, 'note': note});
			}
		});

		let nodesPromise = $Node.Get(nodes)
		.then((response) => {
			//console.log('[Notifications:Nodes]', response.node);
			if ( response.node ) {
				response.node.forEach((node) => {
					node.authors = [];
					if ( node.author > 0 ) {
						if ( users.indexOf(node.author) < 0 ) {
							users.push(node.author);
						}
						node.authors.push(node.author);
					}
					if ( node.meta && node.meta.author ) {
						node.meta.author.forEach((author) => {
							if ( (author > 0) && (users.indexOf(author) < 0) ) {
								users.push(author);
							}
							if ( (author > 0) && (node.authors.indexOf(author) < 0) ) {
								node.authors.push(author);
							}
						});
					}
					nodeLookup.set(node.id, node);
				});
			}

		});

		let notesPromise = $Comment.Get(notes).then((response) => {
			//console.log('[Notifications:Notes]', response.note);
			if ( response.comment ) {
				response.comment.forEach((note) => {
					noteLookup.set(note.id, note);

					if ( (note.author > 0) && (users.indexOf(note.author) < 0) ) {
						users.push(note.author);
					}
				});
			}
		});

		Promise.all([nodesPromise, notesPromise, soicialPromise])
			.then(() => {
				noteLookup.forEach((note, id) => {
					if ( note.node ) {
						note.isNodeAuthor = nodeLookup.get(note.node).authors.indexOf(note.author) > -1;
					}
				});
				return $Node.Get(users);
			})
			.then((response) => {
				//console.log('[Notifications:Users]', response.node);
				if ( response.node ) {
					response.node.forEach((node) => {
						if ( node.type == 'user' ) {
							node.isFriend = social.friends.indexOf(node.id) > -1;
							node.isFollowing = node.isFriend && social.following.indexOf(node.id) > -1;
							node.isFollower = node.isFriend && social.followers.indexOf(node.id) > -1;

							usersLookup.set(node.id, node);
						}
					});
				}

				this.composeNotifications(feed, callerID, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup, social);
			});
	}

	composeNotifications( feed, callerID, notification2nodeAndNote, node2notes, nodeLookup, noteLookup, usersLookup, notificationLookup, social ) {

		const myAtName = '@' + usersLookup.get(callerID).name;
		noteLookup.forEach((note, id) => {
			note.selfauthored = note.author == callerID;
			note.mention = note.body.indexOf(myAtName) >= 0;
		});

		nodeLookup.forEach((node, id) => {
			node.selfauthored = false;
			if ( node.author == callerID ) {
				node.selfauthored = true;
			}
			else if ( node.meta && node.meta.author ) {
				node.meta.author.forEach((author) => {
					if ( author == callerID ) {
						node.selfauthored = true;
					}
				});
			}
			node.mention = (node.body.indexOf(myAtName) >= 0) || (node.name.indexOf(myAtName) >= 0);
		});

		let notifications = this.state.notifications ? this.state.notifications : new Map();
		let notificationIds = this.state.notificationIds;

		let processedNotifications = [];

		let previousData = null;

		feed.forEach((notification) => {
			if ( processedNotifications.indexOf(notification.id) < 0 ) {
				let node = nodeLookup.get(notification.node);
				let data = {
					'node': node,
					'note': undefined,
					'time': new Date(notification.created).getTime(),
					'earliestNoteId': undefined, // Track the note id to link to for this notification.
					'unread': notification.id > this.state.highestRead,
					'notification': [notification],
					'mergeable': false,
					'multi': false,
					'users': new Map(),
					'social': social,
					'callerID': callerID,
				};

				// Look up user records for self and node author.
				data.users.set(callerID, usersLookup.get(callerID));
				data.users.set(node.author, usersLookup.get(node.author));

				// Look up other authors for the node (for team games)
				if ( node.meta && node.meta.author ) {
					node.meta.author.forEach((author) => {
						if ( !data.users.has(author) ) {
							data.users.set(author, usersLookup.get(author));
						}
					});
				}

				// Add author for note, check if this notification be merged
				// Allow merge if it's a note, and if it doesn't contain a mention, isn't self authored, and isn't written by the note author.
				if ( notification.note ) {
					let note = noteLookup.get(notification.note);
					data.note = [note];
					data.earliestNote = notification.note;
					data.users.set(note.author, usersLookup.get(note.author));
					if ( !note.mention && !note.selfauthored && !note.isNodeAuthor ) {
						data.mergeable = true;
					}
				}

				// Will this notification merge with the previous notification?
				let doMerge = false;
				if ( previousData && data.mergeable && previousData.mergeable ) {
					// We can only merge if they're both on the same node, both on the same side of the 'read' boundary, and within a certain amount of time.
					if ( (notification.node == previousData.notification[0].node) && (data.unread == previousData.unread) ) {
						let MaximumMergeTime = 4*60*60*1000; // 4 hours in milliseconds
						if ( Math.abs(data.time - previousData.time) < MaximumMergeTime ) {
							doMerge = true;
						}
					}
				}

				let notificationId = data.notification[0].id;
				processedNotifications.push(notification.id);

				// Skip processing if notification is malformed (note.node == 0)
				if ( data.note && (data.note[0].node == 0) ) {
					// Don't use this notification
				}
				else if ( doMerge ) {
					// Roll current notification into previousData
					previousData.multi = true;
					previousData.notification.push(notification);

					// Add this note and note's author to the previousData lists.
					let note = noteLookup.get(notification.note);
					previousData.note.push(note);
					previousData.users.set(note.author, usersLookup.get(note.author));
					previousData.earliestNote = Math.min(previousData.earliestNote, notification.note);
				}
				else {
					// Not merged into another notification, just add the data structure to output.

					notifications.set(notificationId, data);
					previousData = data;
					notificationIds.push(notificationId);
				}

			}
		});

		this.setState({
			'notifications': notifications,
			'notificationIds': notificationIds.sort((a, b) => b - a),
			'loading': false,
			'feedSize': (this.state.feedSize ? this.state.feedSize : 0) + processedNotifications.length,
		});
	}

	updateCallback() {
		//For subclass to do stuff with
	}

	isLoading() {
		return this.state.loading;
	}

	getNotificationsOrder() {
		return this.state.notificationIds;
	}

	getNotifications( maxCount, clickCallback ) {
		let Notifications = [];
		const notifications = this.state.notifications;
		const notificationsOrder = this.getNotificationsOrder();
		if ( !this.state.loading ) {

			notificationsOrder.forEach((id) => {
				let notification = notifications.get(id);
				if ( (maxCount > 0) && this.shouldShowNotification(notification) ) {
					Notifications.push([id, <Notification notification={notification} onclick={clickCallback} />]);
					maxCount -= 1;
				}
			});

		}

		return Notifications;
	}

	shouldShowNotification( notification ) {
		const {Mention, FriendGame, FriendPost, Feedback, Comment, Other} = $Notification.GetFilters();
		if ( (Feedback !== false) && isNotificationFeedback(notification) ) {
			return true;
		}
		else if ( (Mention !== false) && isNotificationMention(notification) ) {
			return true;
		}
		else if ( (FriendGame !== false) && isNotificationFriendGame(notification) ) {
			return true;
		}
		else if ( (FriendPost !== false) && isNotificationFriendPost(notification) ) {
			return true;
		}
		else if ( (Comment !== false) && isNotificationComment(notification) ) {
			return true;
		}
		return (Other !== false) && isNotificationOther(notification);
	}

	handleFilterChange( filterType, otherStuff ) {
		const myFilter = $Notification.GetFilters();
		myFilter[filterType] = (myFilter[filterType] === undefined) ? false : !myFilter[filterType];
		$Notification.SetFilters(myFilter);
		this.setState({'filters': isFinite(this.state.filters) ? (this.state.filters + 1) : 1});
		//this.setState({'filters': myFilter});
	}
}
