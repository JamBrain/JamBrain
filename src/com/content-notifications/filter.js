import {h, Component}	 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';

export default class NotificationsFilter extends Component {

	constructor(props) {
		super(props);
		this.onToggleComments = () => props.handleFilterChange('comment');
		this.onToggleSelfComments = () => props.handleFilterChange('selfComment');
		this.onToggleFriendPost = () => props.handleFilterChange('friendPost');
		this.onToggleFriendGame = () => props.handleFilterChange('friendGame');
	}

	render(props, state) {
		const {comment, selfComment, friendGame, friendPost} = props.filters;
		return (
			<div>
				<div
					class={cN('-item', selfComment === false ? '' : '-selected')}
					onclick={this.onToggleSelfComments}
				>
					<SVGIcon>bubble-empty</SVGIcon><span>Comments on your stuff</span>
				</div>
				<div
					class={cN('-item', comment === false ? '' : '-selected')}
					onclick={this.onToggleComments}
				>
					<SVGIcon>bubble</SVGIcon><span>Comments</span>
				</div>
				<div
					class={cN('-item', friendGame === false ? '' : '-selected')}
					onclick={this.onToggleFriendGame}
				>
					<SVGIcon>gamepad</SVGIcon><span>Friend's new games</span>
				</div>
				<div
					class={cN('-item', friendPost === false ? '' : '-selected')}
					onclick={this.onToggleFriendPost}
				>
					<SVGIcon>feed</SVGIcon><span>Friend's new posts</span>
				</div>
			</div>
		);
	}
}
