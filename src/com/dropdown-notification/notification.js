import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';

import DropdownCommon					from 'com/input-dropdown/dropdown';

import $Notification					from '../../shrub/js/notification/notification';
import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class DropdownNotification extends Component {

	constructor( props ) {
		super(props);

		this.state = {
			notifications: [],
			notificationsTotal: -1,
		};
	}

	componentDidMount() {
		const showCount = 8;
		if (this.props.getNew) {
			$Notification.GetFeedUnread(Math.max(0, this.props.totalNew - showCount), showCount).then((r) => {
				const caller_id = r.caller_id;
				this.setState({
					status: r.status,
					notificationsTotal: r.feed.length
				});
				r.feed.forEach((notification) => {
					this.queryInfoForNotification(caller_id, notification);
				});

			}).catch((e)=> console.log('[Notification error]', e));
		} else {
			$Notification.GetFeedAll(0, showCount ).then((r) => {
				const caller_id = r.caller_id;
				this.setState({
					status: r.status,
					notificationsTotal: r.feed.length
				});
				r.feed.forEach((notification) => {
					this.queryInfoForNotification(caller_id, notification);
				});
			});
		}
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
				this.setState({notificationsTotal: this.state.notificationsTotal - 1});
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

		let notifications = [...this.state.notifications];
		notifications.push(notification);
		this.setState({notifications: notifications});

		if (this.props.getNew && notifications.length >= this.state.notificationsTotal && notifications.length > 0) {
			let maxId = -1;
			notifications[0].notification.id;
			notifications.forEach((notification) => {
				if (notification.notification.id > maxId) {
					maxId = notification.notification.id;
				}
			});
			$Notification.SetMarkRead(maxId);
			if (this.props.countCallback) {
				this.props.countCallback(notifications.length);
			}
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

	getNotifications() {
		let Notifications = [];
		const feed = this.state.notifications;

		if (feed && feed.length > 0) {

			feed.forEach((notification) => {
				if (notification) {
					//console.log('feed:notification', notification);

					//Todo look for atting in posts I haven't written
					let Notification = null;

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
								Notification = (
									<NavLink href={notification.node.path}>
									{noteAuthor.name} mentioned you in a commented on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>"
									</NavLink>
								);
							} else {
								Notification = (
									<NavLink href={notification.node.path}>
									{noteAuthor.name} commented on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>"
									</NavLink>
								);
							}
						} else if (notification.node.selfauthored && !notification.note.selfauthored) {
							Notification = (
								<NavLink href={notification.node.path}>
								{noteAuthor.name} commented on your {nodeType} "<em>{notification.node.name}</em>"
								</NavLink>
							);
						} else {
							//Notification about weird stuff
							Notification = (
								<NavLink href={notification.node.path}>
								You recieved notification that you posted a comment on {nodeAuthor.name}'s {nodeType} "<em>{notification.node.name}</em>" please report to dev-team that you already knew this.
								</NavLink>
							);
						}
					} else {
						if (notification.node.selfauthored) {

							Notification = (
								<NavLink href={notification.node.path}>
								Your {nodeType} "<em>{notification.node.name}</em>" was either created or updated.
								</NavLink>
							);
						} else {

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
								Notification = (
									<NavLink href={notification.node.path}>
									{User} posted "<em>{notification.node.name}</em>"
									</NavLink>
								);
							} else {
								Notification = (
									<NavLink href={notification.node.path}>
									{User} posted a {nodeType} "<em>{notification.node.name}</em>"
									</NavLink>
								);
							}
						}

					}

					if (Notification !== null) {
						Notifications.push([notification.notification.id, Notification]);
					}
				} else {
					console.log('[rejectedNotification]', notification);
				}
			});

		}

		return Notifications;
	}

	onModifyFunction(id) {
		if (id == -1) {
			if (this.props.hideCallback) {
				this.props.hideCallback();
			}
		}
	}

	render( props ) {
		const state = this.state;

		let ShowSpinner = null;
		let Notifications = [];

		if (state.status === undefined) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			Notifications = [[null, (<div>An error occurred retrieving the notifications...</div>)]];
		} else {
			if (state.notificationsTotal > state.notifications.length) {
				ShowSpinner = (<NavSpinner />);
			}
			Notifications = this.getNotifications();
		}

		if (ShowSpinner !== null) {
			Notifications.push([null, ShowSpinner]);
		}

		if (Notifications.length > 0) {
			Notifications.push([-1, (<NavLink href='/home/notifications'><em>View notifications feed...</em></NavLink>)]);
		}

		//TODO: Push link to /home/notifications

		return (
			<DropdownCommon class='-notifications' items={Notifications} startExpanded={true} hideSelectedField={true} onmodify={ (id) => this.onModifyFunction(id) } />
		);
	}
}
