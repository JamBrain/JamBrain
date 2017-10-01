import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';

import $Notification					from '../../shrub/js/notification/notification';
import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class NotificationItem extends Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			notification: null,
			loaded: false,
		};
	}
	
	componentDidMount() {
		this.queryInfoForNotification(this.props.caller_id, this.props.notification);		
	}

	queryInfoForNotification(caller_id, notification) {
		let results = {
			caller_id: caller_id,
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
				
				if (this.props.failCallback) {
					this.props.failCallback(this.props.id);
				}
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

		this.setState({notification: notification, loaded: true});
		
		if (this.props.markReadyCallback) {
			this.props.markReadyCallback(notification.notification.id);
		}
				
	}

	getSocialStringList(notification, relation) {
		const social = notification.people[relation];
		let isFriend = social.has(notification.node.author);
		let myFriends = isFriend ? new Set(notification.users.get(notification.node.author)) : new Set();
		
		if (notification.node.link) {
			notification.node.link.forEach((author) => {
				if (social.has(author)) {
					isFriend = true;
					myFriends.add(notification.users.get(author));
				}
			});
		}
		
		let User = null;
		const friendArray = [...myFriends];
		let names = null;
		if (friendArray.length > 1) {
			names = friendArray.slice(0, friendArray.length - 1).join(', ') + ' & ' + friendArray[friendArray.length - 1];
		} else {
			names = friendArray[0];
		}	
		return {count: myFriends.size, string: names, list: myFriends};
	}	

	render() {

		const notification = this.state.notification;
				
		if (notification == null || !this.state.loaded) {
			return null;
		}
		
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
		
		if (notification.notification.note) {

			if (!notification.node.selfauthored && !notification.note.selfauthored) {
				const myAtName = "@" + notification.users.get(notification.caller_id).name;
				const firstAt = notification.note.body.indexOf(myAtName);
				if (firstAt > -1) {
					return (								
						<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
						{noteAuthor.name} mentioned you in a commented on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);								
				} else {
					return (
						<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
						{noteAuthor.name} commented on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);
				}
			} else if (notification.node.selfauthored && !notification.note.selfauthored) {							
				return (
					<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
					{noteAuthor.name} commented on your {nodeType} "<em>{notification.node.name}</em>"
					</NavLink>);							
			} else {
				return (
					<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
					You recieved notification that you posted a comment on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>" please report to dev-team that you already knew this.
					</NavLink>);
			}
		} else {
			if (notification.node.selfauthored) {
				return (
					<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
					Your {nodeType} "<em>{notification.node.name}</em>" was either created or updated.
					</NavLink>);
			} else {
				//Todo look for atting in posts I haven't written
				const myAtName = "@" + notification.users.get(notification.caller_id).name;
				const mentioned = Math.max(
					notification.node.body.indexOf(myAtName),
					notification.node.name.indexOf(myAtName)) > -1;
				
			
				const friends = this.getSocialStringList(notification, 'friends');
				
				if (friends.count > 0) {
					User = (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.string}</span>);
				} else {
					const following = this.getSocialStringList(notification, 'following');
					if (following.count > 0) {
						User = (<span>{following.string}</span>);
					} else {
						User = (<span>{nodeAuthor.name}</span>);
					}
				}
				
				if (notification.node.type == 'post') {
					if (mentioned) {
						return (
							<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
								{User} mentioned you in their post "<em>{notification.node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
								{User} posted "<em>{notification.node.name}</em>"
							</NavLink>);						
					}						
					
				} else {
					if (mentioned) {
						return (
							<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
							{User} mentioned you in their {nodeType} "<em>{notification.node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={notification.node.path} title={'Notifiaction Id: ' + notification.notification.id}>
							{User} posted a {nodeType} "<em>{notification.node.name}</em>"
							</NavLink>);
						
					}						
				}
			}
			
		}

	}
	
	
}