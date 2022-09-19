import {h, Component}	 				from 'preact/preact';
import UIIcon							from 'com/ui/icon';
import UICheckbox						from 'com/ui/checkbox/checkbox';
import {
	isNotificationComment,
	isNotificationFeedback,
	isNotificationFriendGame,
	isNotificationFriendPost,
	isNotificationMention,
	isNotificationOther
}						from 'com/content-notifications/notification';

export default class NotificationsFilter extends Component {

	constructor(props) {
		super(props);
		this.onToggleComments = () => props.handleFilterChange('Comment');
		this.onToggleMention = () => props.handleFilterChange('Mention');
		this.onToggleFeedback = () => props.handleFilterChange('Feedback');
		this.onToggleFriendPost = () => props.handleFilterChange('FriendPost');
		this.onToggleFriendGame = () => props.handleFilterChange('FriendGame');
		this.onToggleOther = () => props.handleFilterChange('Other');
	}

	render(props, state) {
		const {Comment, Feedback, FriendGame, FriendPost, Mention, Other} = props.filters;
		const {notifications} = props;

		let hiddenComments = null;
		if (Comment === false) {
			const count = notifications.filter(e => isNotificationComment(e)).length;
			hiddenComments = ` (${count})`;
		}
		let hiddenFeedback = null;
		if (Feedback === false) {
			const count = notifications.filter(e => isNotificationFeedback(e)).length;
			hiddenFeedback = ` (${count})`;
		}
		let hiddenMention = null;
		if (Mention === false) {
			const count = notifications.filter(e => isNotificationMention(e)).length;
			hiddenMention = ` (${count})`;
		}
		let hiddenFriendPost = null;
		if (FriendPost === false) {
			const count = notifications.filter(e => isNotificationFriendPost(e)).length;
			hiddenFriendPost = ` (${count})`;
		}
		let hiddenFriendGame = null;
		if (FriendGame === false) {
			const count = notifications.filter(e => isNotificationFriendGame(e)).length;
			hiddenFriendGame = ` (${count})`;
		}
		let hiddenOther = null;
		if (Other === false) {
			const count = notifications.filter(e => isNotificationOther(e)).length;
			hiddenOther = ` (${count})`;
		}

		return (
			<div>
				<UICheckbox
					class="-filter"
					value={Mention !== false}
					onClick={this.onToggleMention}
				>
					<UIIcon>at</UIIcon><span>Mentions{hiddenMention}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Feedback !== false}
					onClick={this.onToggleFeedback}
				>
					<UIIcon>bubble-empty</UIIcon><span>Feedback{hiddenFeedback}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Comment !== false}
					onClick={this.onToggleComments}
				>
					<UIIcon>bubble</UIIcon><span>Comments{hiddenComments}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={FriendGame !== false}
					onClick={this.onToggleFriendGame}
				>
					<UIIcon>gamepad</UIIcon><span>Friend's games{hiddenFriendGame}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={FriendPost !== false}
					onClick={this.onToggleFriendPost}
				>
					<UIIcon>feed</UIIcon><span>Friend's posts{hiddenFriendPost}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Other !== false}
					onClick={this.onToggleOther}
				>
					<UIIcon>question</UIIcon><span>Other{hiddenOther}</span>
				</UICheckbox>
			</div>
		);
	}
}
