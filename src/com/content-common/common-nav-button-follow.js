import {Component} from 'preact';
import './common-nav-button-follow.less';

import {Icon, Button} from 'com/ui';
import $NodeStar from 'backend/js/node/node_star';


export default class BodyNavButtonFollow extends Component {
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
		let {node, user} = this.props;
		let following = this.state.isFollowing;

		return following !== null ? following : user.private && user.private.meta && user.private.meta.star && (user.private.meta.star.indexOf(node.id) !== -1);
	}
	isFriend() {
		let {node, user} = this.props;

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
			this.setState({'isFollowing': false});

			// TODO: Tell parent user has changed
		})
		.catch(err => {
			this.setState({'error':err});
		});
	}


	onClick( e ) {
		return this.isFollowing() ? this.onUnfollow(e) : this.onFollow(e);
	}


	render( props ) {
		const {node, user, ...otherProps} = props;

		if ( user && user.id && node && node.id ) {
			let isFollowing = this.isFollowing();
			let isFriend = isFollowing ? this.isFriend() : false;

			let newClass = "-follow";

			var icon = <Icon class="if-not-hover-block">user</Icon>;
			var hoverIcon = <Icon class="if-hover-block">user-plus</Icon>;
			var text = <div>Follow</div>;

			// Following or Friend
			if ( isFollowing ) {
				hoverIcon = <Icon class="if-hover-block">user-minus</Icon>;
			}
			// Friend only
			if ( isFriend ) {
				icon = <Icon class="if-not-hover-block">users</Icon>;
				text = <div>Friends</div>;
				newClass += " -friends";
			}
			// Following only
			else if ( isFollowing ) {
				icon = <Icon class="if-not-hover-block">user-check</Icon>;
				text = <div>Following</div>;
				newClass += "-following";
			}

			return (
				<Button class={`${newClass ?? ''} ${props.class ?? ''}`} onClick={this.onClick}>
					{icon}
					{hoverIcon}
					{text}
				</Button>
			);
		}

		return null;
	}
}
