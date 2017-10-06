import { h, Component } 				from 'preact/preact';

import NavLink 							from 'com/nav-link/link';

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

	render( props, state ) {

		//TODO: Potentially add a svg-icon circle with number for how many notifications are per line since number of
		//notification-rows here will not match the notifications count if the rows have been collapsed into
		//multi-notification

		const caller_id = props.caller_id;
		const notification = props.notification;

		let nodeType = notification.node.type;
		if (notification.node.subtype) {
			nodeType = notification.node.subtype;
		}

		const myAtName = "@" + notification.users.get(caller_id).name;
		const node = notification.node;
		const note = notification.note && notification.note.length == 1 ? notification.note[0] : null;

		const nodeAuthor = notification.users.get(node.author).name;
		let NodeAuthor = this.isNoteNodeAuthor(node, note) ? 'their' : (<span><NavLink class='-at-name'>@{nodeAuthor}</NavLink>'s</span>);
		let NodeAuthorSubject = this.isNoteNodeAuthor(node, note) ? 'their' : (<span><NavLink class='-at-name'>@{nodeAuthor}</NavLink></span>);
		const notificationData = notification.notification[0];

		if (notification.multi) {
			const count = notification.notification.length;
			const authors = [];

			notification.note.forEach((note) => {
				if (authors.indexOf(note.author) == -1) {
					authors.push(note.author);
				}
			});

			const friends = this.getSocialStringList(authors, notification.social.friends);
			let also = 'also ';
			if (node.selfauthored) {
				NodeAuthor = 'your';
				also='';
			}

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
					Your friends {friends.string} {extra} {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
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
						{following.string} {extra} {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);

				} else {
					return (
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{count} users {also} commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
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
						{NoteAuthor} mentioned you in a commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);
				} else {
					return (
						<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
						{NoteAuthor} also commented on {NodeAuthor} {nodeType} "<em>{node.name}</em>"
						</NavLink>);
				}
			} else if (notification.node.selfauthored && !notification.note.selfauthored) {
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
					{NoteAuthor} commented on your {nodeType} "<em>{node.name}</em>"
					</NavLink>);
			} else {
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id}>
					You recieved notification that you posted a comment on {NodeAuthor} {nodeType} "<em>{node.name}</em>" please report to the dev-team that you already knew this.
					</NavLink>);
			}
		} else {
			if (node.selfauthored) {
				return (
					<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id}>
					Your {nodeType} "<em>{node.name}</em>" was either created or updated.
					</NavLink>);
			} else {

				const friends = this.getSocialStringList(node.authors, notification.social.friends);

				if (friends.count > 0) {
					User = (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.string}</span>);
				} else {
					const following = this.getSocialStringList(node.authors, notification.social.following);
					if (following.count > 0) {
						User = (<span>{following.string}</span>);
					} else {
						User = (NodeAuthorSubject);
					}
				}

				if (notification.node.type == 'post') {
					if (node.mention) {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
								{User} mentioned you in their post "<em>{node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
								{User} posted "<em>{node.name}</em>"
							</NavLink>);
					}

				} else {
					if (node.mention) {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
							{User} mentioned you in their {nodeType} "<em>{node.name}</em>"
							</NavLink>);
					} else {
						return (
							<NavLink href={node.path} title={'Notifiaction Id: ' + notificationData.id} class={props.class} id={props.id} >
							{User} posted a {nodeType} "<em>{node.name}</em>"
							</NavLink>);

					}
				}
			}

		}

	}


}
