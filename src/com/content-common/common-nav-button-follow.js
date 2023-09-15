import {Component} from 'preact';
import './common-nav-button-follow.less';

import {Icon} from 'com/ui';
import BodyNavButton from './common-nav-button';
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
		let {node, user} = props;

		if ( user && user.id && node && node.id ) {
			let isFollowing = this.isFollowing();
			let isFriend = isFollowing ? this.isFriend() : false;

			let newClass = "-follow";

			var Icon = <Icon class="if-not-hover-block">user</Icon>;
			var HoverIcon = <Icon class="if-hover-block">user-plus</Icon>;
			var Text = <div>Follow</div>;

			// Following or Friend
			if ( isFollowing ) {
				HoverIcon = <Icon class="if-hover-block">user-minus</Icon>;
			}
			// Friend only
			if ( isFriend ) {
				Icon = <Icon class="if-not-hover-block">users</Icon>;
				Text = <div>Friends</div>;
				newClass += " -friends";
			}
			// Following only
			else if ( isFollowing ) {
				Icon = <Icon class="if-not-hover-block">user-check</Icon>;
				Text = <div>Following</div>;
				newClass += "-following";
			}

			return (
				<BodyNavButton class={`${newClass ?? ''} ${props.class ?? ''}`} onClick={this.onClick}>
					{Icon}
					{HoverIcon}
					{Text}
				</BodyNavButton>
			);
		}

		return null;
	}
}
