import { Component } from 'preact';
import './notifications.less';

import { getRoughAge } from 'internal/time';
import NavLink 							from 'com/nav-link/link';
import ButtonLink						from 'com/button-link/link';
import UIIcon 							from 'com/ui/icon';


export const commentAuthorIsAmongNodeAuthors = ( notification ) => {
	const {node, comment} = notification;
	return comment
		.map(n => node.authors.indexOf(n.author) > -1)
		.indexOf(true) > -1;
};

export const callerIDIsAmongNodeAuthors = ( notification ) => {
	return notification.node.authors.indexOf(notification.callerId) > -1;
};

export const isNotificationType = (notification, notificationType) => {
	return notification.notification
		.map(e => e.type)
		.indexOf(notificationType) > -1;
};

export const isNotificationMention = (notification) => {
	return isNotificationType(notification, 'mention');
};

export const isNotificationFeedback = (notification) => {
	return isNotificationType(notification, 'feedback') || (isNotificationType(notification, 'comment') && callerIDIsAmongNodeAuthors(notification));
};

export const isNotificationFriendGame = (notification) => {
	return isNotificationType(notification, 'item');
};

export const isNotificationFriendPost = (notification) => {
	return isNotificationType(notification, 'post');
};

export const isNotificationComment = (notification) => {
	return isNotificationType(notification, 'comment') && !callerIDIsAmongNodeAuthors(notification);
};

export const isNotificationOther = (notification) => {
	return !isNotificationType(notification, 'comment') && !isNotificationType(notification, 'node') && !isNotificationType(notification, 'item') && !isNotificationType(notification, 'post') && !isNotificationType(notification, 'mention') && !isNotificationType(notification, 'feedback');
};

export default class NotificationItem extends Component {

	constructor( props ) {
		super(props);
	}

	getSocial( users, authors, relation, possesive=false ) {
		const uniqueAuthors = authors.filter((a, i) => authors.indexOf(a) == i);
		const isRelation = uniqueAuthors.map(a => relation.indexOf(a) > -1);
		const count = isRelation.filter(e => e).length;
		let Relations = [];

		if (count > 0) {

			isRelation.forEach((e, i) => {
				if ( e ) {
					if (possesive) {
						Relations.push(<span><NavLink class="-at-name" key={i}>{'@' + users.get(uniqueAuthors[i]).name}</NavLink>'s</span>);
					}
					else {
						Relations.push(<NavLink class="-at-name" key={i}>{'@' + users.get(uniqueAuthors[i]).name}</NavLink>);
					}
				}
			});
			const nRelations = Relations.length;
			if (nRelations > 3 || nRelations < uniqueAuthors.length) {
				Relations = Relations.slice(0, 3);
				const listed = Relations.length;
				for (let i=Relations.length - 1; i>0; i-=1) {
					Relations.splice(i, 0, ', ');
				}
				Relations.push(' & ' + (uniqueAuthors.length - listed) + ' more');
			}
			else if ( nRelations > 1 ) {
				for (let i=nRelations-1; i>0; i-=1) {
					Relations.splice(i, 0, i == nRelations - 1 ? ' & ' : ', ');
				}
			}
		}

		return {"count": count, "content": Relations};
	}

	isCommentNodeAuthor( node, comment ) {
		return comment && comment.length == 1 ? node.authors.indexOf(comment[0].author) > -1 : false;
	}

	getNodeAuthorAsSubjectJSX( notification ) {
		const {node, social, users, callerID} = notification;
		const friends = this.getSocial(users, node.authors, social.friends);
		if ( node.authors.indexOf(callerID) > -1) {
			return <span>You</span>;
		}
		else if ( friends.count > 0 ) {
			return (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.content}</span>);
		}
		else {
			const following = this.getSocial(users, node.authors, social.following);
			if ( following.count > 0 ) {
				return <span>{following.content}</span>;
			}
			else {
				return (<span><NavLink class="-at-name">@{users.get(node.author).name}</NavLink></span>);
			}
		}
	}

	getNodeAuthorAsObjectJSX( notification ) {
		const {node, social, users, callerID, comment} = notification;
		const friends = this.getSocial(users, node.authors, social.friends, true);
		if ( node.authors.indexOf(callerID) > -1) {
			return <span>your</span>;
		}
		else if (this.isCommentNodeAuthor(node, comment)) {
			return <span>their</span>;
		}
		else if ( friends.count > 0 ) {
			return (<span>your friend{friends.count > 1 ? 's' : ''} {friends.content}</span>);
		}
		else {
			const following = this.getSocial(users, node.authors, social.following, true);
			if ( following.count > 0 ) {
				return (<span>{following.content}</span>);
			}
			else {
				return (<span><NavLink class="-at-name">@{users.get(node.author).name}</NavLink>'s</span>);
			}
		}
	}

	getCommentAuthorAsSubjectJSX( notification ) {
		const {comment, social, users, callerID} = notification;
		const commentAuthors = comment.map(n => n.author);
		const friends = this.getSocial(users, commentAuthors, social.friends);

		if ( commentAuthors.indexOf(callerID) > -1) {
			return <span>You</span>;
		}
		else if ( friends.count > 0 ) {
			return (<span>Your friend{friends.count > 1 ? 's' : ''} {friends.content}</span>);
		}
		else {
			const following = this.getSocial(users, commentAuthors, social.following);
			if ( following.count > 0 ) {
				return <span>{following.content}</span>;
			}
			else if (commentAuthors.length > 1) {
				return <span>{commentAuthors.length} users</span>;
			}
			else if (commentAuthors.length == 1 && users.get(commentAuthors[0])) {
				return <span><NavLink class="-at-name">@{users.get(commentAuthors[0]).name}</NavLink></span>;
			}
			else {
				return <span>Someone</span>;
			}
		}
	}

	getNodeType( notification ) {
		let nodeType = notification.node.type;
		if ( notification.node.subtype ) {
			nodeType = notification.node.subtype;
		}
		return nodeType;
	}

	getNavProps( props ) {
		const {notification} = props;
		const notificationData = notification.notification[0];
		const navProps = {
			"href": notification.node.path,
			"title": ('Notification Id: ' + notificationData.id),
			"class": props.class,
			"id": props.id,
			'onClick': props.onClick,
		};

		if ( notification.comment ) {
			navProps.href += "#/comment-" + notification.earliestComment;
		}
		return navProps;
	}

	getTimePrefix( notification ) {
		const date_now = new Date();
		const time_diff = (date_now.getTime() - notification.time);
		const timePrefix = getRoughAge(time_diff);
		return timePrefix;
	}

	renderOther( notification, timePrefix, navProps ) {
		const NodeType = this.getNodeType(notification);
		const NotificationType = notification.notification[0].type;
		const {node} = notification;

		if (notification.comment) {
			const CommentAuthor = this.getCommentAuthorAsSubjectJSX(notification);
			const NodeAuthor = this.getNodeAuthorAsObjectJSX(notification);
			return (
				<ButtonLink {...navProps} >
					<UIIcon>quesition</UIIcon>{timePrefix} {CommentAuthor} caused unhandled notification {NotificationType} for {NodeAuthor} {NodeType} "<em>{node.name}</em>"
				</ButtonLink>
			);
		}
		else {
			const NodeAuthor = this.getNodeAuthorAsSubjectJSX(notification);
			return (
				<ButtonLink {...navProps} >
					<UIIcon>quesition</UIIcon>{timePrefix} {NodeAuthor} caused unhandled notification {NotificationType} with their {NodeType} "<em>{node.name}</em>"
				</ButtonLink>
			);
		}
	}

	renderFeedback( notification, timePrefix, navProps) {
		const CommentAuthor = this.getCommentAuthorAsSubjectJSX(notification);
		const NodeType = this.getNodeType(notification);
		const {node} = notification;

		return (
			<ButtonLink {...navProps} >
				<UIIcon>bubble-empty</UIIcon>{timePrefix} {CommentAuthor} commented on your {NodeType} "<em>{node.name}</em>"
			</ButtonLink>
		);
	}

	renderComment( notification, timePrefix, navProps) {
		const CommentAuthor = this.getCommentAuthorAsSubjectJSX(notification);
		const NodeAuthor = this.getNodeAuthorAsObjectJSX(notification);
		const NodeType = this.getNodeType(notification);
		const {node, comment} = notification;

		return (
			<ButtonLink {...navProps} >
				<UIIcon>{comment.length > 1 ? 'bubbles' : 'bubble'}</UIIcon>{timePrefix} {CommentAuthor} commented on {NodeAuthor} {NodeType} "<em>{node.name}</em>"
			</ButtonLink>
		);
	}

	renderFriendsItem( notification, timePrefix, navProps ) {
		const NodeAuthor = this.getNodeAuthorAsSubjectJSX(notification);
		const NodeType = this.getNodeType(notification);
		const {node} = notification;

		return (
			<ButtonLink {...navProps} >
				<UIIcon>gamepad</UIIcon> {timePrefix} {NodeAuthor} published a {NodeType} "<em>{node.name}</em>"
			</ButtonLink>
		);
	}

	renderFriendsPost( notification, timePrefix, navProps ) {
		const NodeAuthor = this.getNodeAuthorAsSubjectJSX(notification);
		const {node} = notification;

		return (
			<ButtonLink {...navProps} >
				<UIIcon>feed</UIIcon> {timePrefix} {NodeAuthor} posted "<em>{node.name}</em>"
			</ButtonLink>
		);
	}

	renderMention( notification, timePrefix, navProps) {
		const {node} = notification;
		const NodeType = this.getNodeType(notification);

		if (notification.comment) {
			const CommentAuthor = this.getCommentAuthorAsSubjectJSX(notification);
			const NodeAuthor = this.getNodeAuthorAsObjectJSX(notification);
			return (
				<ButtonLink {...navProps} >
					<UIIcon>at</UIIcon> {timePrefix} {CommentAuthor} mentioned you in a comment on {NodeAuthor} {NodeType} "<em>{node.name}</em>"
				</ButtonLink>
			);
		}
		else {
			const NodeAuthor = this.getNodeAuthorAsSubjectJSX(notification);
			return (
				<ButtonLink {...navProps} >
					<UIIcon>at</UIIcon> {timePrefix} {NodeAuthor} mentioned you in their {NodeType} "<em>{node.name}</em>"
				</ButtonLink>
			);
		}
	}

	render( props, state ) {

		const {notification} = props;
		const navProps = this.getNavProps(props);
		const timePrefix = this.getTimePrefix(notification);

		if (isNotificationFeedback(notification)) {
			return this.renderFeedback(notification, timePrefix, navProps);
		}
		else if (isNotificationMention(notification)) {
			return this.renderMention(notification, timePrefix, navProps);
		}
		else if (isNotificationFriendGame(notification)) {
			return this.renderFriendsItem(notification, timePrefix, navProps);
		}
		else if (isNotificationFriendPost(notification)) {
			return this.renderFriendsPost(notification, timePrefix, navProps);
		}
		else if (isNotificationComment(notification)) {
			return this.renderComment(notification, timePrefix, navProps);
		}
		else if (isNotificationOther(notification)) {
			return this.renderOther(notification, timePrefix, navProps);
		}
		else {
			console.error("[ERROR: bad notification]", notification);
		}
	}
}
