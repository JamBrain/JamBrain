import {h, Component}	 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';

export default class NotificationsFilter extends Component {

	constructor(props) {
		super(props);
		this.onToggleComments = () => props.handleFilterChange('comment');
		this.onToggleMention = () => props.handleFilterChange('mention');
		this.onToggleSelfComments = () => props.handleFilterChange('selfComment');
		this.onToggleFriendPost = () => props.handleFilterChange('friendPost');
		this.onToggleFriendGame = () => props.handleFilterChange('friendGame');
		this.onToggleOther = () => props.handleFilterChange('other');
	}

	render(props, state) {
		const {comment, selfComment, friendGame, friendPost, mention, other} = props.filters;
		return (
			<div>
				<ButtonBase
					class={cN('-filter', mention === false ? '' : '-toggled')}
					onclick={this.onToggleMention}
				>
					<SVGIcon>at</SVGIcon><span>Mentions</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', selfComment === false ? '' : '-toggled')}
					onclick={this.onToggleSelfComments}
				>
					<SVGIcon>bubble-empty</SVGIcon><span>Feedback</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', comment === false ? '' : '-toggled')}
					onclick={this.onToggleComments}
				>
					<SVGIcon>bubble</SVGIcon><span>Comments</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', friendGame === false ? '' : '-toggled')}
					onclick={this.onToggleFriendGame}
				>
					<SVGIcon>gamepad</SVGIcon><span>Friend's games</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', friendPost === false ? '' : '-toggled')}
					onclick={this.onToggleFriendPost}
				>
					<SVGIcon>feed</SVGIcon><span>Friend's posts</span>
				</ButtonBase>
				<ButtonBase
					class={cN('-filter', other === false ? '' : '-toggled')}
					onclick={this.onToggleFriendPost}
				>
					<SVGIcon>question</SVGIcon><span>Other</span>
				</ButtonBase>
			</div>
		);
	}
}
