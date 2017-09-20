import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

import DropdownCommon					from 'com/dropdown-common/common';

import $Notification					from '../../shrub/js/notification/notification';
import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class DropdownNotification extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			notifications: new Map(),			
		};
	}

	componentDidMount() {
		if (this.props.getNew) {
			$Notification.GetFeedUnread(0, 8).then((r) => {
				//TODO: Spinner should only stop when all notifications have been processed or discarded
				this.setState({status: r.status});
				this.queryInfoForNotification(r.caller_id, r.feed[0]);

			}).catch((e)=> console.log('[Notification error]', e));
		} else {
			$Notification.GetFeedAll(-8, 8).then((r) => {
				this.queryInfoForNotification(r.feed[0]);
				
			});			
		}
	}
	
	queryInfoForNotification(caller_id, notification) {
		
		let results = {
			users: new Map([[caller_id, null]]),
			usersCompleted: 'no',
			people: {},
			node: {},
			note: {},
			notification: notification,
		};
		
		$Node.GetMy().then((response) => {
			results.people = {
				following: response.star ? response.star : [],
				followers: response.refs.star ? response.refs.star : [],
				friends: Array.isArray(response.refs.star) ? new Set([...response.star].filter((i) => response.refs.star.indexOf(i) > -1)) : [],			
			};
			results.people.following.forEach((user) => {
				results.users.set(user, null);
			});
			results.people.followers.forEach((user) => {
				results.users.set(user, null);
			});
			results.people.completed = true;
			this.processNotificationStepTwo(results);
		});
		
		$Node.Get(notification.node).then((response) => {
			const nodes = response.node;
			if (nodes && nodes.length == 1) {
				const node = nodes[0];
				results.node = node;
				results.node.selfauthored = false;
				if (node.author == caller_id) {
					results.node.selfauthored = true;
				} else if (node.link && node.link.author) {
					node.link.author.forEach((author) => {
						if (author == caller_id) {
							results.node.selfauthored = true;
						}
					});
				}
				
				results.node.completed = true;
				
				if (!results.node.selfauthored) {
					results.users.set(node.author, null);
					if (node.link.author) {
						node.link.author.forEach((user_id) => {
							results.users.set(user_id, null);
						});
					}					
				}
				this.processNotificationStepTwo(results);
			} else {
				results.node = {corrupted: true, completed: true};
			}
		});
		
		if (notification.note) {
			$Note.Get(notification.node).then((response) => {
				if (response.note && response.note.length > 0) {
					response.note.forEach((note) => {
						if (note.id == notification.note) {
							results.note = note;
							results.note.selfauthored = note.author == caller_id;
							results.note.completed = true;
							if (!results.note.selfauthored) {
								results.users.set(note.author, null);
							}						
						}
						
					});
				}
				this.processNotificationStepTwo(results);
			});
		} else {
			results.note.completed = true;
			this.processNotificationStepTwo(results);
		}
			
	}
	
	processNotificationStepTwo(notification) {
		if (!(notification.people.completed && notification.note.completed && notification.node.completed)) {
			return;
		}
		
		if (notification.usersCompleted == 'no') {
			notification.usersCompleted = 'started';
			let users = [];
			notification.users.forEach((value, key) => users.push(key));			
			$Node.Get(users).then((response) => {
				response.node.forEach((node) => {
					if (node.type == 'user') {
						notification.users.set(node.id, node);
					}
				});
				notification.usersCompleted = 'yes';
				this.processNotificationStepTwo(notification);
			});			
			return;
		} else if (notification.usersCompleted == 'started') {
			return;
		}
		
		this.setState(
			{notifications: new Map(
				[...this.state.notifications]
					.concat([[notification.notification.id, notification]]))});		
	}
	
	getNotifications() {
		let Notifications = [];
		const feed = this.state.notifications;
		
		if (feed && feed.size > 0) {
			
			feed.forEach((notification) => {
				if (notification) {
					console.log('feed:notification', notification);
					//TODO: Make real notifications based on the notification-data
					let nodeType = notification.node.type;
					if (notification.node.subtype) {
						nodeType = notification.node.subtype;
					}
					
					let nodeAuthor = null;
					if (notification.node) {
						nodeAuthor = notification.users.get(notification.node.author);
					}
					let noteAuthor = null;
					if (notification.note) {
						noteAuthor = notification.users.get(notification.note.author);
					}
					
					if (notification.notification.note && !notification.node.selfauthored && !notification.note.selfauthored) {
						Notifications.push((
							<div>
							{noteAuthor.name} commented on {nodeAuthor.name}'s {nodeType}
							&nbsp;"<em>{notification.node.name}</em>"&nbsp;
							that you have commented on as well.
							</div>
							
						));
					} else {
					
						Notifications.push((
							<div>Type: {nodeType}, {notification.node.name}: {notification.notification.note}<br />
							({notification.notification.created})</div>));
						
					}
				} else {
					console.log('[rejectedNotification]', notification);
				}
			});

		}
		return Notifications;
	}
	
	render( props ) {
		const state = this.state;
		
		let ShowSpinner = null;
		let Notifications = null;
		
		if (state.status === undefined) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			Notifications = (<div>An error occurred retrieving the notifications...</div>);
		} else {
			Notifications = this.getNotifications();
		}
		
		return (
			<DropdownCommon>
			{Notifications}
			{ShowSpinner}
			</DropdownCommon>
		);
	}
	
}