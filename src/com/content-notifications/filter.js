import {h, Component}	 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';
import {
	isNotifactionComment,
	isNotificationFeedback,
	isNotificationFriendGame,
	isNotificationFriendPost,
	isNotificationMention,
	isNotificationOther
}						from 'com/content-notifications/notification';

export default class NotificationsFilter extends Component {

	constructor(props) {
		super(props);
		this.onToggleComments = () => props.handleFilterChange('comment');
		this.onToggleMention = () => props.handleFilterChange('mention');
		this.onToggleFeedback = () => props.handleFilterChange('feedback');
		this.onToggleFriendPost = () => props.handleFilterChange('friendPost');
		this.onToggleFriendGame = () => props.handleFilterChange('friendGame');
		this.onToggleOther = () => props.handleFilterChange('other');
	}

	render(props, state) {
		const {comment, feedback, friendGame, friendPost, mention, other} = props.filters;
		const {notifications} = props;

		let hiddenComments = null;
		if (comment === false) {
			const count = notifications.filter(e => isNotifactionComment(e)).length;
			hiddenComments = ` (${count})`;
		}
		let hiddenFeedback = null;
		if (feedback === false) {
			const count = notifications.filter(e => isNotificationFeedback(e)).length;
			hiddenFeedback = ` (${count})`;
		}
		let hiddenMention = null;
		if (mention === false) {
			const count = notifications.filter(e => isNotificationMention(e)).length;
			hiddenMention = ` (${count})`;
		}
		let hiddenFriendPost = null;
		if (friendPost === false) {
			const count = notifications.filter(e => isNotificationFriendPost(e)).length;
			hiddenFriendPost = ` (${count})`;
		}
		let hiddenFriendGame = null;
		if (friendGame === false) {
			const count = notifications.filter(e => isNotificationFriendGame(e)).length;
			hiddenFriendGame = ` (${count})`;
		}
		let hiddenOther = null;
		if (other === false) {
			const count = notifications.filter(e => isNotificationOther(e)).length;
			hiddenOther = ` (${count})`;
		}

		return (
			<div>
				<ButtonBase
					class={cN('-filter', mention === false ? '' : '-toggled')}
					onclick={this.onToggleMention}
				>
					<SVGIcon>at</SVGIcon><span>Mentions{hiddenMention}</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', feedback === false ? '' : '-toggled')}
					onclick={this.onToggleFeedback}
				>
					<SVGIcon>bubble-empty</SVGIcon><span>Feedback{hiddenFeedback}</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', comment === false ? '' : '-toggled')}
					onclick={this.onToggleComments}
				>
					<SVGIcon>bubble</SVGIcon><span>Comments{hiddenComments}</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', friendGame === false ? '' : '-toggled')}
					onclick={this.onToggleFriendGame}
				>
					<SVGIcon>gamepad</SVGIcon><span>Friend's games{hiddenFriendGame}</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', friendPost === false ? '' : '-toggled')}
					onclick={this.onToggleFriendPost}
				>
					<SVGIcon>feed</SVGIcon><span>Friend's posts{hiddenFriendPost}</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', other === false ? '' : '-toggled')}
					onclick={this.onToggleOther}
				>
					<SVGIcon>question</SVGIcon><span>Other{hiddenOther}</span>
				</ButtonBase>
			</div>
		);
	}
}
