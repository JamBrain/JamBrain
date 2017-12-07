import {h, Component} 					from 'preact/preact';
import Shallow			 				from 'shallow/shallow';

import ButtonBase						from 'com/button-base/base';
import ButtonLink						from 'com/button-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import NavSpinner						from 'com/nav-spinner/spinner';

import UIButton							from 'com/ui/button/button';

//import DropdownUser 					from 'com/dropdown-user/user';
import BarNotification					from 'bar-notifications';
import BarUser							from 'bar-user';

//import $Node							from 'shrub/js/node/node';
import $Notification					from 'shrub/js/notification/notification';


function make_url( url ) {
	return url + window.location.search;
}

export default class ViewBar extends Component {
	constructor( props ) {
		super(props);

		this.StartedNotificationLoop = false;

		this.state - {
			notifications: 0,
			notificationCountAdjustment: 0,
		};
	}

	checkNotificationCount() {
		const {user} = this.props;
		const loggedIn = user && (user.id > 0);

		if (loggedIn) {
			let firstCall = !this.StartedNotificationLoop;
			this.StartedNotificationLoop = true;

			if ( document.hidden && !firstCall ) {
				// Page is hidden - Don't do any actual querying, just set the timeout to come back later
				// But, if this was the first check, always try to get the notifications regardless.
				setTimeout(() => this.checkNotificationCount(), 20000);
			}
			else {
				$Notification.GetCountUnread()
				.then((r) => {
					if (this.state.notifications != r.count) {
						this.setState({notifications: r.count, notificationCountAdjustment: 0});
					}
					setTimeout(() => this.checkNotificationCount(), 60000);
				})
				.catch((e) => {
					setTimeout(() => this.checkNotificationCount(), 5 * 60000);
					console.log('[Notificaton error]', e);
				});
			}
		}
		else {
			this.StartedNotificationLoop = false;
		}
	}

	componentDidMount() {
		document.body.classList.add('_use-view-bar');

		this.checkNotificationCount();
	}

	componentWillUnmount() {
		document.body.classList.remove('_use-view-bar');
		document.body.classList.remove('_static-view-bar');
	}

//	componentWillReceiveProps( nextProps ) {
//		if ( Shallow.Diff(nextProps, this.props) ) {
////			console.log('featured',nextProps.featured);
//		}
//	}

	shouldComponentUpdate( nextProps, nextState ) {
		var ret = Shallow.Compare(this, nextProps, nextState);
		//console.log(ret, nextProps.featured);
		return ret;
	}

	componentDidUpdate() {
		// When the user changes (and anything else changes) check to see if we should start the notification checking loop.
		if ( !this.StartedNotificationLoop ) {
			this.checkNotificationCount();
		}
	}

	renderLeft() {
	}

	renderRight( user, featured ) {
		var Search = null;
//		var Search = (
//			<ButtonBase class="-bar-icon" onclick={e => { console.log('search'); window.location.hash = "#search"; }}>
//				<SVGIcon baseline>search</SVGIcon>
//			</ButtonBase>
//		);

		var ShowCalendar = (
			<UIButton class="-bar-button if-no-sidebar-block" onclick={e => { console.log('calendar'); window.location.hash = "#cal"; }}>
				<SVGIcon baseline>calendar</SVGIcon>
				<div class="if-sidebar-block">Schedule</div>
			</UIButton>
		);

		let ShowJoin = null;
		let ShowMyGame = null;
		let NewPost = null;
		let Notification = null;
		let ShowUser = null;
		let Register = null;
		let Login = null;
		let GoSecure = null;
		let ShowSpinner = null;
		let ShowNotifications = null;

		// Disallow insecure login
		if ( SECURE_LOGIN_ONLY && (location.protocol !== 'https:') ) {
			let SecureURL = 'https://'+location.hostname+location.pathname+location.search+location.hash;
			GoSecure = (
				<UIButton class="-bar-button" href={SecureURL} onclick={e => {console.log('secure'); location.href = SecureURL;}}>
					<SVGIcon>unlocked</SVGIcon>
					<div class="if-sidebar-block">Go to Secure Site</div>
				</UIButton>
			);
		}
		// Both user and user.id means logged in
		else if ( user && user.id ) {
			if ( featured && featured.id ) {
				if ( featured.focus ) {
					ShowMyGame = (
						<UIButton href={featured.what_node[featured.focus].path} class="-bar-button">
							<SVGIcon>gamepad</SVGIcon>
							<div class="if-sidebar-block">My Game</div>
						</UIButton>
					);

					NewPost = (
						<UIButton class="-bar-button" onclick={e => { window.location.hash = "#create/"+featured.focus+"/post"; }}>
							<SVGIcon>edit</SVGIcon>
							<div class="if-sidebar-block">New</div>
						</UIButton>
					);
				}
				else if ( node_CanCreate(featured) ) {
					ShowJoin = (
						<UIButton class="-bar-button" onclick={e => { window.location.hash = "#create/"+featured.id+"/item/game"; }}>
							<SVGIcon>publish</SVGIcon>
							<div class="if-sidebar-block">Join Event</div>
						</UIButton>
					);
				}
			}

			// Notifications
			let NotificationCount = null;
			const notificationCount = Math.max(0, this.state.notifications - this.state.notificationCountAdjustment);
			if (notificationCount > 0) {
				NotificationCount = (<div class="-count">{notificationCount}</div>);
			}

			if (this.state.showNotifications) {
				ShowNotifications = (<BarNotification clearCallback={ () => this.setState({notifications: 0}) } hideCallback={ () => this.setState({showNotifications: false}) } />);
			}

			Notification = (
				<UIButton class="-bar-icon" onclick={(e) => {
					// TODO: if the main content is the notifications feed, clicking the button should
					// probably not show the dropdown, but load new comments into the feed.
					this.setState({showNotifications: !this.state.showNotifications});
				}}>
					<SVGIcon baseline>bubble</SVGIcon>
					{NotificationCount}
				</UIButton>
			);

/*
			// TODO: Pull this out of the user meta, else use a dummy
			let Avatar = (user.meta && user.meta.avatar) ? <img src={"//"+STATIC_DOMAIN+user.meta.avatar} /> : <img src={'//'+STATIC_DOMAIN+'/other/dummy/user64.png'} />;
			//'/other/logo/mike/Chicken64.png';
			let MyURL = '/users/'+user.slug+'/';
			ShowUser = [
				<UIButton class="-user">
					<NavLink href={MyURL}>{Avatar}</NavLink>
				</UIButton>,
//				<DropdownUser />
			];
*/

			ShowUser = <BarUser user={user} />;
		}
		// If user has finished loading (and is not logged in)
		else if ( user ) {
			Register = (
				<UIButton class="-bar-button" onclick={e => { console.log('register'); window.location.hash = "#user-register"; }}>
					<SVGIcon>user-plus</SVGIcon>
					<div class="if-sidebar-block">Create Account</div>
				</UIButton>
			);
			Login = (
				<UIButton class="-bar-button" onclick={e => { console.log('login'); window.location.hash = "#user-login"; }}>
					<SVGIcon>key</SVGIcon>
					<div class="if-sidebar-block">Login</div>
				</UIButton>
			);
		}
		// Still waiting
		else {
			ShowSpinner = <NavSpinner />;
		}

		if ( ShowSpinner ) {
			return (
				<div class="-fake-right">
					{ShowSpinner}
				</div>
			);
		}
		else {
			return (
				<div class="-right">
					{ShowJoin}
					{ShowMyGame}
					{NewPost}
					{ShowCalendar}
					{Search}
					{Notification}
					{ShowNotifications}
					{ShowUser}
					{Register}
					{Login}
					{GoSecure}
				</div>
			);
		}
	}

	render( props ) {
		let {user, featured, loading} = props;
		let ShowLoading;

		if ( loading ) {
			ShowLoading = (<NavSpinner />);
		}

		return (
			<div class="view-bar">
				<div class="-content">
					<div class="-left">
						<UIButton href="/" class="-logo">
							<SVGIcon class="if-sidebar-block" baseline>ludum</SVGIcon><SVGIcon class="if-sidebar-block" baseline>dare</SVGIcon>
							<SVGIcon class="if-no-sidebar-block" baseline>l-udum</SVGIcon><SVGIcon class="if-no-sidebar-block" baseline>d-are</SVGIcon>
						</UIButton>
					</div>
					{ShowLoading}
					{this.renderRight(user, featured)}
				</div>
			</div>
		);
	}
}
