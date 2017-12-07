import {h, Component}	 				from 'preact/preact';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';


export const isNotificationType = (notification, notificationType) => {
	return notification.notification
		.map(e => e.type)
		.indexOf(notificationType) > -1;
};

export const isNotificationMention = (notification) => {
	return isNotificationType(notification, 'mention');
};

export const isNotificationFeedback = (notification) => {
	const {node, note} = notification;
	return node.selfauthored && note && isNotificationType(notification, 'note');
};

export const isNotificationFriendGame = (notification) => {
	const {node} = notification;
	return node.type == 'item' && isNotificationType(notification, 'item');
};

export const isNotificationFriendPost = (notification) => {
	const {node} = notification;
	return node.type !== 'item' && isNotificationType(notification, 'post');
};

export const isNotificationComment = (notification) => {
	const {node, note} = notification;
	return notification.multi || (note && isNotificationType(notification, 'note') && !isNotificationFeedback(notification) && !isNotificationFeedback(notification));
};

export const isNotificationOther = (notification) => {
	return !isNotificationType(notification, 'note') && !isNotificationType(notification, 'node') && !isNotificationType(notification, 'item') && !isNotificationType(notification, 'post') && !isNotificationType(notification, 'mention');
};

export default class NotificationItem extends Component {

	constructor( props ) {
		super(props);
	}

	getSocialStringList(authors, relation) {
		let isRelation = authors.map((a) => relation.indexOf(a) > -1);
		let anyRelation = isRelation.length > 0 ? isRelation.reduce((l, r) => l || r) : false;
		let names = '';
		let Relations = [];

		if (anyRelation) {

			isRelation.forEach((e, i) => {
				if ( e ) {
					Relations.push('<NavLink class=\'-at-name\'>@' + authors[i] + '</NavLink>');
				}
			});
			if ( Relations.length > 3 ) {
				names = Relations.slice(0, 3).join(', ') + ' & more';
			}
			else if ( Relations.length > 1 ) {
				names = Relations.slice(0, Relations.length - 1).join(', ') + ' & ' + Relations[Relations.length - 1];
			}
			else {
				names = Relations[0];
			}

		}

		return {"count": Relations.length, "string": names};

	}

	isNoteNodeAuthor(node, note) {
		return note ? node.authors.indexOf(note.author) > -1 : false;
	}

	render( props, state ) {

		//TODO: Potentially add a svg-icon circle with number for how many notifications are per line since number of
		//notification-rows here will not match the notifications count if the rows have been collapsed into
		//multi-notification

		const caller_id = props.caller_id;
		const notification = props.notification;
		const date_now = new Date();
		const time_diff = (date_now.getTime() - notification.time);
		const timePrefix = getRoughAge(time_diff);

		let nodeType = notification.node.type;
		if ( notification.node.subtype ) {
			nodeType = notification.node.subtype;
		}

		const myAtName = "@" + notification.users.get(caller_id).name;
		const node = notification.node;
		const note = notification.note && notification.note.length == 1 ? notification.note[0] : null;

		const nodeAuthor = notification.users.get(node.author).name;
		let NodeAuthor = this.isNoteNodeAuthor(node, note) ? 'their' : (<span><NavLink class="-at-name">@{nodeAuthor}</NavLink>'s</span>);
		let NodeAuthorSubject = this.isNoteNodeAuthor(node, note) ? 'their' : (<span><NavLink class="-at-name">@{nodeAuthor}</NavLink></span>);
		const notificationData = notification.notification[0];

		const navProps = {"href": node.path, "title": ('Notification Id: ' + notificationData.id), "class": props.class, "id": props.id};
		if ( notification.note ) {
			navProps.href += "#/comment-" + notification.earliestNote;
		}

		if ( notification.multi ) {
			const count = notification.notification.length;
			const authors = [];

			notification.note.forEach((note) => {
				if (authors.indexOf(note.author) == -1) {
					authors.push(note.author);
				}
			});
			let multiIcon = 'bubbles';
			const friends = this.getSocialStringList(authors, notification.social.friends);
			let also = 'also ';
			if ( node.selfauthored ) {
				NodeAuthor = 'your';
				also='';
				multiIcon = 'bubble-empty';
			}

			if ( friends.count > 0 ) {
				let others = count - following.count;
				let extra = null;
				if ( others == 1 ) {
					extra = ' & one more';
				}
				else if ( others > 1 ) {
					extra = ' & ' + others + ' more';
				}

				return (
					<NavLink {...navProps} >
					<SVGIcon>{multiIcon}</SVGIcon> Your friends {friends.string} {extra} {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
					</NavLink>);
			}
			else {
				const following = this.getSocialStringList(authors, notification.social.following);
				if ( following.count ) {
					let others = count - following.count;
					let extra = null;
					if ( others == 1 ) {
						extra = ' & one more';
					}
					else if ( others > 1 ) {
						extra = ' & ' + others + ' more';
					}

					return (
						<NavLink {...navProps} >
						<SVGIcon>{multiIcon}</SVGIcon>{timePrefix} {following.string} {extra} {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);

				}
				else {
					return (
						<NavLink {...navProps} >
						<SVGIcon>{multiIcon}</SVGIcon>{timePrefix} {count} users {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);

				}
			}
		}
		else if ( notification.note ) {
			const note = notification.note[0];
			let NoteAuthor = null;
			if ( note.author > 0 ) {
				NoteAuthor = <NavLink class="-at-name">@{notification.users.get(note.author).name}</NavLink>;
			}
			else {
				NoteAuthor = <NavLink class="-at-name -anonymous">An anonymous user</NavLink>;
			}

			if ( !node.selfauthored && !note.selfauthored ) {

				if ( note.mention ) {
					return (
						<NavLink {...navProps} >
						<SVGIcon>at</SVGIcon> {timePrefix} {NoteAuthor} mentioned you in a comment on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);
				}
				else {
					return (
						<NavLink {...navProps} >
						<SVGIcon>bubble</SVGIcon>{timePrefix} {NoteAuthor} also commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);
				}
			}
			else if ( notification.node.selfauthored && !notification.note.selfauthored ) {
				return (
					<NavLink {...navProps} >
					<SVGIcon>bubble-empty</SVGIcon>{timePrefix} {NoteAuthor} commented on your {nodeType} "<em>{node.name}</em>"
					</NavLink>);
			}
			else {
				return (
					<NavLink {...navProps} >
					<SVGIcon>question</SVGIcon>{timePrefix} You recieved a notification that you posted a comment on {NodeAuthor} {nodeType} "<em>{node.name}</em>" please report to the dev-team that you already knew this.
					</NavLink>);
			}
		}
		else {
			if ( node.selfauthored ) {
				return (
					<NavLink {...navProps} >
					{timePrefix} Your {nodeType} "<em>{node.name}</em>" was either created or updated.
					</NavLink>);
			}
			else {

				const friends = this.getSocialStringList(node.authors, notification.social.friends);

				if ( friends.count > 0 ) {
					User = (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.string}</span>);
				}
				else {
					const following = this.getSocialStringList(node.authors, notification.social.following);
					if ( following.count > 0 ) {
						User = (<span>{following.string}</span>);
					}
					else {
						User = (NodeAuthorSubject);
					}
				}

				let thing = notification.node.type;
				let posted = "posted a " + thing;
				if ( notification.node.type == 'post' ) {
					posted = "posted";
				}
				else if ( notification.node.type == 'item' ) {
					thing = "game";
					posted = "posted a game";
				}

				if (node.mention) {
					return (
						<NavLink {...navProps} >
						<SVGIcon>at</SVGIcon> {timePrefix} {User} mentioned you in their {thing} "<em>{node.name}</em>"
						</NavLink>);
				}
				else {
					let icon = "info";
					if (thing == "game") {
						icon = "gamepad";
					}
					else if (thing == "post") {
						icon = "feed";
					}
					else if (thing == "article") {
						icon = "article";
					}
					else {
						console.log(thing);
					}
					return (
						<NavLink {...navProps} >
						<SVGIcon>{icon}</SVGIcon> {timePrefix} {User} {posted} "<em>{node.name}</em>"
						</NavLink>);
				}
			}

		}

	}


}
