import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';

import $Notification					from '../../shrub/js/notification/notification';
import $Node							from '../../shrub/js/node/node';
import $Note							from '../../shrub/js/note/note';

export default class NotificationItem extends Component {
	
	constructor( props ) {
		super(props);
		//console.log('[Notification:Loading]', props.notification.id);
		/*this.state = {
			notification: null,
			loaded: false,
		};*/
	}
	/*
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
	*/
	
	getSocialStringList(authors, relation) {
		let isRelation = authors.map((a) => relation.indexOf(a) > -1);
		let anyRelation = isRelation.reduce((l, r) => l || r);
		let names = '';
		let Relations = [];
		
		if (isRelation) {
			
			isRelation.forEach((e, i) => { if (e) { Relations.push('<NavLink class=\'-at-name\'>@' + authors[i] + '</NavLink>');}});
			if (Relations.length > 3) {
				names = Relations.slice(0, 3).join(', ') + ' & more';
			} else if (Relations.length > 1) {
				names = Relations.slice(0, Relations.length - 1).join(', ') + ' & ' + Relations[Relations.length - 1];
			} else {
				names = Relations[0];
			}	

		}
		
		return {count: Relations.length, string: names};

	}	

	isNoteNodeAuthor(node, note) {
		return note ? node.authors.indexOf(note.author) > -1 : false;
	}
	
	render( {caller_id, notification}, state ) {
				
		/*
		if (notification == null || !state.loaded) {
			return null;
		}
		*/
		
		let nodeType = notification.node.type;
		if (notification.node.subtype) {
			nodeType = notification.node.subtype;
		}
		
		/*
		let nodeAuthor = null;
		if (notification.node) {
			nodeAuthor = notification.users.get(notification.node.author);
		}
		let noteAuthor = null;
		if (notification.note) {
			noteAuthor = notification.users.get(notification.note.author);
		}
		*/
		const myAtName = "@" + notification.users.get(caller_id).name;
		const node = notification.node;
		const note = notification.note && notification.note.length == 1 ? notification.note[0] : null;

		const nodeAuthor = notification.users.get(caller_id).name;
		const NodeAuthor = this.isNoteNodeAuthor(node, note) ? 'their' : (<span><NavLink class='-at-name'>@{nodeAuthor}</NavLink>'s</span>);
		const notificationData = notification.notification[0];
		
		if (notification.multi) {
			const count = notification.notification.length;
			const authors = [];

			notification.note.forEach((note) => {
				if (authors.indexOf(note.author) == -1) {
					authors.push(note.author);
				}
			});
			
			console.log(authors, notification, notification.social);
			const friends = this.getSocialStringList(authors, notification.social.friends);
			
			if (friends.count > 0) {
				let others = count - following.count;					
				let extra = null;
				if (others == 1) {
					extra = ' & one more';
				} else if (others > 1) {
					extra = ' & ' + others + ' more';
				}
				
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
					Your friends {friends.string} {extra} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
					</NavLink>);
					
			} else {
				const following = this.getSocialStringList(authors, notification.social.following);
				if (following.count) {
					let others = count - following.count;					
					let extra = null;
					if (others == 1) {
						extra = ' & one more';
					} else if (others > 1) {
						extra = ' & ' + others + ' more';
					}
					
					return (
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{following.string} {extra} commented on {NodeAuthor} {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);
					
				} else {
					return (
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{count} users commented on {NodeAuthor} {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);
					
				}
			}
				
		} else if(notification.notification.note) {
			const note = notification.note[0];			
			const NoteAuthor = <NavLink class='-at-name'>@{notification.users.get(note.author).name}</NavLink>;
			
			if (!node.selfauthored && !note.selfauthored) {				
				
				if (note.mention) {
					return (								
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{NoteAuthor} mentioned you in a commented on {NodeAuthor} {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);							
				} else {
					return (
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{NoteAuthor} also commented on {NodeAuthor} {nodeType} "<em>{notification.node.name}</em>"
						</NavLink>);
				}
			} else if (notification.node.selfauthored && !notification.note.selfauthored) {							
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
					{NoteAuthor} commented on your {nodeType} "<em>{notification.node.name}</em>"
					</NavLink>);							
			} else {
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id}>
					You recieved notification that you posted a comment on <NavLink class='-at-name'>@{nodeAuthor.name}</NavLink>'s {nodeType} "<em>{notification.node.name}</em>" please report to the dev-team that you already knew this.
					</NavLink>);
			}
		} else {
			if (node.selfauthored) {
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id}>
					Your {nodeType} "<em>{notification.node.name}</em>" was either created or updated.
					</NavLink>);
			} else {
							
				const friends = this.getSocialStringList(node.authors, notification.social.friends);
				
				if (friends.count > 0) {
					User = (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.string}</span>);
				} else {
					const following = this.getSocialStringList(note.authors, notification.social.following);
					if (following.count > 0) {
						User = (<span>{following.string}</span>);
					} else {
						User = (NodeAuthor);
					}
				}
				
				if (notification.node.type == 'post') {
					if (node.mention) {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
								{User} mentioned you in their post "<em>{notification.node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
								{User} posted "<em>{notification.node.name}</em>"
							</NavLink>);						
					}						
					
				} else {
					if (node.mention) {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
							{User} mentioned you in their {nodeType} "<em>{notification.node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
							{User} posted a {nodeType} "<em>{notification.node.name}</em>"
							</NavLink>);
						
					}						
				}
			}
			
		}

	}
	
	
}