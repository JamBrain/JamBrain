import { h, Component } 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';

import NavButton						from 'com/content-common/common-nav-button';

import $NodeStar						from '../shrub/js/node/node_star';

export default class ContentCommonNavButtonFollow extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'isFollowing': null,
		};

		this.onFollow = this.onFollow.bind(this);
		this.onUnfollow = this.onUnfollow.bind(this);

		this.onClick = this.onClick.bind(this);
	}

	isFollowing() {
		var node = this.props.node;
		var user = this.props.user;
		var following = this.state.isFollowing;

		return following !== null ? following : user.private && user.private.link && user.private.link.star && user.private.link.star.indexOf(node.id) !== -1;
	}
	isFriend() {
		var node = this.props.node;
		var user = this.props.user;

		return user.private.refs.star && user.private.refs.star.indexOf(node.id) !== -1;
	}


	onFollow( e ) {
		return $NodeStar.Add(this.props.node.id)
		.then(r => {
			this.setState({ 'isFollowing': true });

			// TODO: Tell parent user has changed
		})
		.catch(err => {
			this.setState({'error':err});
		});
	}
	onUnfollow( e ) {
		return $NodeStar.Remove(this.props.node.id)
		.then(r => {
			this.setState({ 'isFollowing': false });

			// TODO: Tell parent user has changed
		})
		.catch(err => {
			this.setState({'error':err});
		});
	}

	onClick( e ) {
		if ( this.isFollowing() ) {
			return this.onUnfollow(e);
		}
		else {
			return this.onFollow(e);
		}
	}

	render( props ) {
		var node = props.node;
		var user = props.user;

		if ( user && user.id !== 0 ) {
			var isFriend = false;
			var isFollowing = this.isFollowing();
			if ( isFollowing )
				isFriend = this.isFriend();

			var Class = [];
			if ( props.class )
				Class = Class.concat(props.class.split(' '));
			Class.push('-follow');

			var Icon = <SVGIcon class="if-not-hover-block">user</SVGIcon>;
			var HoverIcon = <SVGIcon class="if-hover-block">user-plus</SVGIcon>;
			var Text = <div>Follow</div>;

			// Following or Friend
			if ( isFollowing ) {
				HoverIcon = <SVGIcon class="if-hover-block">user-minus</SVGIcon>;
			}
			// Friend only
			if ( isFriend ) {
				Icon = <SVGIcon class="if-not-hover-block">users</SVGIcon>;
				Text = <div>Friends</div>;
				Class.push('-friends');
			}
			// Following only
			else if ( isFollowing ) {
				Icon = <SVGIcon class="if-not-hover-block">user-check</SVGIcon>;
				Text = <div>Following</div>;
				Class.push('-following');
			}

			if ( node && node.slug ) {
				return (
					<NavButton class={Class} onclick={this.onClick}>
						{Icon}
						{HoverIcon}
						{Text}
					</NavButton>
				);
			}
		}
		return null;
	}
}
