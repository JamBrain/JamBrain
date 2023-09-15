import { Component } from 'preact';
import './bar.less';
import Shallow from 'shallow';
import { node_CanCreate } from 'internal/lib';

import {UIIcon, UIButton, UISpinner} from 'com/ui';

//import DropdownUser 					from 'com/dropdown-user/user';
import BarNotification					from './bar-notifications';
import BarUser							from './bar-user';

//import $Node							from 'backend/js/node/node';
import $Notification					from 'backend/js/notification/notification';


function make_url( url ) {
	return url + window.location.search;
}

export default class ViewBar extends Component {
	constructor( props ) {
		super(props);
		this.StartedNotificationLoop = false;

		this.state = {
			'notifications': 0,
			'notificationsHidden': 0,
			'notificationsFeed': null,
			//'notificationsMore': false,
		};

		this.handleNotificationsClear = this.handleNotificationsClear.bind(this);
		this.handleNotificationsHide = this.handleNotificationsHide.bind(this);
	}

	handleNotificationsClear() {
		this.setState({
			'notifications': 0,
			'notificationsHidden': 0,
			//'notificationsFeed': null,
			//'notificationsMore': false,
		});
		this.refreshFavIconNotificationCount();
	}

	handleNotificationsHide() {
		this.setState({'showNotifications': false});
	}

	checkNotificationCount() {
		//return; // HACK! Comment me to restore notifications

		const {user} = this.props;
		const loggedIn = user && (user.id > 0);
		const fetchCount = 40;

		if (loggedIn) {
			let firstCall = !this.StartedNotificationLoop;
			this.StartedNotificationLoop = true;

			if ( document.hidden && !firstCall ) {
				// Page is hidden - Don't do any actual querying, just set the timeout to come back later
				// But, if this was the first check, always try to get the notifications regardless.
				setTimeout(() => this.checkNotificationCount(), 20000);
			}
			else {
				const {notifications, notificationsFeed} = this.state;
				$Notification.GetCountUnread()
				.then(r => {
					if (r.status !== 200) {
						location.href = '# expired';
						setTimeout(() => this.checkNotificationCount(), 5 * 60000);
						return Promise.reject();
					}
					const newUnfilteredCount = r.count;
					// Only get unread if there's a possibility that there are new notifications
					// Only get the feed in general if it hasn't been requested before.
					const request = newUnfilteredCount > (notifications || 0) ?
						$Notification.GetFeedUnreadFiltered :
						!notificationsFeed && $Notification.GetFeedAllFiltered;
					request && request(0, fetchCount)
					.then(r => {
						if (this.state.notifications != r.count) {
							this.setState({
								'notifications': newUnfilteredCount > 0 ? r.count : 0,
								'notificationsHidden': r.countFiltered,
								//'notificationsMore': r.countFiltered + r.count == fetchCount,
								'notificationsFeed': r,
								'notificationsError': null,
							});
							this.refreshFavIconNotificationCount();
						}
						setTimeout(() => this.checkNotificationCount(), 60000);
					})
					.catch((e) => {
						this.setState({'notificationsError': 'Could not retrieve notifications feed.'});
						setTimeout(() => this.checkNotificationCount(), 5 * 60000);
						DEBUG && console.log('[Notificaton error]', e);
						// @endif
					});
				})
				.catch((e) => {
					this.setState({'notificationsError': 'Could not retrieve notifications count.'});
					setTimeout(() => this.checkNotificationCount(), 5 * 60000);
					DEBUG && console.log('[Notificaton count error]', e);
				});
			}
		}
		else {
			this.handleNotificationsClear();
			this.StartedNotificationLoop = false;
		}
	}

	componentDidMount() {
		//document.body.classList.add('_use-view-bar');

		if ( !this.StartedNotificationLoop ) {
			this.checkNotificationCount();
		}
	}

	componentWillUnmount() {
		//document.body.classList.remove('_use-view-bar');
		//document.body.classList.remove('_static-view-bar');
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

	/**
	 * Adds the # of notifications in the favicon.
	 * Shows individual numbers until 9, then 9+ for more.
	 */
	refreshFavIconNotificationCount() {
		const notificationCount = this.state.notifications || 0;
		// remove existing icon if any
		const el = document.querySelector("link[rel='shortcut icon']");
		if (el) el.parentNode.removeChild(el);
		const icon = new Image();
		icon.setAttribute('src', '/favicon.ico');
		icon.onload = () => {
			// reload LD favicon and paint it
			const canvas = document.createElement('canvas');
			canvas.setAttribute('width', icon.naturalWidth.toString());
			canvas.setAttribute('height', icon.naturalHeight.toString());
			const context = canvas.getContext('2d');
			// place LD image as background
			context.drawImage(icon, 0, 0);
			// draw text when # notifs > 0
			if (notificationCount > 0) {
				const text = notificationCount > 9 ? "9+" : String(notificationCount);
				// fill with a dark backdrop for contrast
				context.fillStyle = '#6f7984';
				context.rect(text.length > 1 ? 14 : 38, 30, 50, 50);
				context.fill();
				context.fillStyle = '#eef2f7';
				context.font = 'bold 36px tahoma';
				context.fillText(text, text.length > 1 ? 16 : 40, 64);
			}
			// replace favicon
			const link = document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = canvas.toDataURL("image/x-icon");
			document.getElementsByTagName('head')[0].appendChild(link);
		};
	}

	renderLeft() {
	}

	renderRight( user, featured ) {
		var Search = null;
//		var Search = (
//			<ButtonBase class="bar-icon" onClick={e => { console.log('search'); window.location.hash = "#search"; }}>
//				<UIIcon baseline>search</UIIcon>
//			</ButtonBase>
//		);

		var ShowCalendar = (
			<UIButton
				class="bar-button if-no-sidebar-block"
				onClick={e => {
					//console.log('calendar');
					window.location.hash = "#cal";
				}}
			>
				<UIIcon baseline>calendar</UIIcon>
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
				<UIButton
					class="bar-button"
					noblank
					href={SecureURL}
				>
					<UIIcon>unlocked</UIIcon>
					<div class="if-sidebar-block">Go to Secure Site</div>
				</UIButton>
			);
		}
		// Both user and user.id means logged in
		else if ( user && user.id ) {
			if ( featured && featured.id ) {
				// Has a game
				if ( featured.focus_id && featured.what ) {
					ShowMyGame = (
						<UIButton title="My Game" href={featured.what[featured.focus_id].path} class="bar-button">
							<UIIcon>gamepad</UIIcon>
							<div class="if-sidebar-block">My Game</div>
						</UIButton>
					);

					NewPost = (
						<UIButton
							title="New Post"
							class="bar-button"
							onClick={e => {
								window.location.hash = "#create/"+featured.focus_id+"/post";
							}}
						>
							<UIIcon>edit</UIIcon>
							<div class="if-sidebar-block">New Post</div>
						</UIButton>
					);
				}
				// Let them create a game
				else if ( node_CanCreate(featured, "item/game") ) {
					ShowJoin = (
						<UIButton
							title="Join Event"
							class="bar-button"
							onClick={e => {
								window.location.hash = "#create/"+featured.id+"/item/game";
							}}
						>
							<UIIcon>publish</UIIcon>
							<div class="if-sidebar-block">Join Event</div>
						</UIButton>
					);
				}
			}

			// Notifications
			let NotificationCount = null;
			const notificationCount = this.state.notifications;
			if (notificationCount > 0) {
				/*
				if (this.state.notificationsMore) {
					NotificationCount = (<div class="-count">{notificationCount}<sup>+</sup></div>);

				}
				else { */
				NotificationCount = (<div class="-count">{notificationCount}</div>);
			}
			/* else if (this.state.notificationsMore) {
				if (NotificationCount === null) {
					NotificationCount = (<div class="-count">+</div>);
				}
			}
			else if (this.state.notificationsHidden) {
				NotificationCount = (<div class="-count">({this.state.notificationsHidden})</div>);
			} */

			if (this.state.showNotifications) {
				ShowNotifications = (
					<BarNotification
						feed={this.state.notificationsFeed}
						anythingToMark={this.state.notifications > 0 || this.state.notificationsHidden > 0}
						clearCallback={this.handleNotificationsClear}
						hideCallback={this.handleNotificationsHide}
						error={this.state.notificationsError}
					/>
				);
			}

			Notification = (
				<UIButton title="Notifications" class="bar-icon" onClick={(e) => {
					// TODO: if the main content is the notifications feed, clicking the button should
					// probably not show the dropdown, but load new comments into the feed.
					this.setState({'showNotifications': !this.state.showNotifications});
				}}>
					<UIIcon baseline>bubble</UIIcon>
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
				<UIButton
					class="bar-button"
					onClick={e => {
						//console.log('register');
						window.location.hash = "#user-register";
					}}
				>
					<UIIcon>user-plus</UIIcon>
					<div class="if-sidebar-block">Create Account</div>
				</UIButton>
			);
			Login = (
				<UIButton
					class="bar-button"
					onClick={e => {
						//console.log('login');
						window.location.hash = "#user-login";
					}}
				>
					<UIIcon>key</UIIcon>
					<div class="if-sidebar-block">Login</div>
				</UIButton>
			);
		}
		// Still waiting
		else {
			ShowSpinner = <UISpinner />;
		}

		if ( ShowSpinner ) {
			return (
				<section class="fake-right">
					{ShowSpinner}
				</section>
			);
		}
		else {
			return (
				<section class="right">
					{ShowJoin}
					{ShowMyGame}
					{NewPost}
					{Search}
					{Notification}
					{ShowNotifications}
					{ShowUser}
					{Register}
					{Login}
					{GoSecure}
				</section>
			);
		}
	}

	/*{ShowCalendar}*/

	render( props ) {
		let {user, featured, loading} = props;
		let ShowLoading;

		if ( loading ) {
			ShowLoading = (<UISpinner />);
		}

		return (
			<section id="layout-top">
				<nav id="navbar">
					<section class="left">
						<UIButton title="Ludum Dare" href="/" class="logo">
							<UIIcon class="if-sidebar-block" baseline>ludum</UIIcon><UIIcon class="if-sidebar-block" baseline>dare</UIIcon>
							<UIIcon class="if-no-sidebar-block" baseline>l-udum</UIIcon><UIIcon class="if-no-sidebar-block" baseline>d-are</UIIcon>
						</UIButton>
					</section>
					{ShowLoading}
					{this.renderRight(user, featured)}
				</nav>
			</section>
		);
	}
}
