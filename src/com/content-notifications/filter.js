import {h, Component}	 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
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
					onclick={this.onToggleMention}
				>
					<SVGIcon>at</SVGIcon><span>Mentions{hiddenMention}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Feedback !== false}
					onclick={this.onToggleFeedback}
				>
					<SVGIcon>bubble-empty</SVGIcon><span>Feedback{hiddenFeedback}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Comment !== false}
					onclick={this.onToggleComments}
				>
					<SVGIcon>bubble</SVGIcon><span>Comments{hiddenComments}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={FriendGame !== false}
					onclick={this.onToggleFriendGame}
				>
					<SVGIcon>gamepad</SVGIcon><span>Friend's games{hiddenFriendGame}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={FriendPost !== false}
					onclick={this.onToggleFriendPost}
				>
					<SVGIcon>feed</SVGIcon><span>Friend's posts{hiddenFriendPost}</span>
				</UICheckbox>
				<UICheckbox
					class="-filter"
					value={Other !== false}
					onclick={this.onToggleOther}
				>
					<SVGIcon>question</SVGIcon><span>Other{hiddenOther}</span>
				</UICheckbox>
			</div>
		);
	}
}
