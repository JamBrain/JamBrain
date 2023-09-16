import { Component } from 'preact';
import './bar.less';
import Shallow from 'shallow';
import { node_CanCreate } from 'internal/lib';

import {Icon, Button, IconButton, UISpinner} from 'com/ui';

//import DropdownUser 					from 'com/dropdown-user/user';
import BarNotification					from './bar-notifications';
import BarUser							from './bar-user';

//import $Node							from 'backend/js/node/node';
import $Notification					from 'backend/js/notification/notification';


const LogoButton = () =>
<Button title="Ludum Dare" href="/" class="logo">
	<Icon class="if-sidebar-block" baseline src="ludum" /><Icon class="if-sidebar-block" baseline src="dare" />
	<Icon class="if-no-sidebar-block" baseline src="l-udum" /><Icon class="if-no-sidebar-block" baseline src="d-are" />
</Button>;

const SearchButton = () => <IconButton icon="search" class="bar-icon" onClick={e => {window.location.hash = "#search";}} />;

const CalendarButton = () =>
<IconButton class="bar-button if-no-sidebar-block" icon="calendar" /*baseline*/ onClick={e => {window.location.hash = "#cal";}}>
	<div class="if-sidebar-block">Schedule</div>
</IconButton>;

const RegisterNewUserButton = () =>
<IconButton icon="user-plus" class="bar-button" onClick={e => {window.location.hash = "#user-register";}}>
	<div class="if-sidebar-block">Create Account</div>
</IconButton>;

const LoginButton = () =>
<IconButton icon="key" class="bar-button" onClick={e => {window.location.hash = "#user-login";}}>
	<div class="if-sidebar-block">Login</div>
</IconButton>;

const JoinEventButton = (props) =>
<IconButton icon="publish" title="Join Event" class="bar-button" onClick={e => {window.location.hash = `#create/${props.eventId}/item/game`;}}>
	<div class="if-sidebar-block">Join Event</div>
</IconButton>;

const MyGameButton = (props) =>
<IconButton icon="gamepad" title="My Game" href={props.href} class="bar-button">
	<div class="if-sidebar-block">My Game</div>
</IconButton>;

const NewPostButton = (props) =>
<IconButton icon="edit" title="New Post" class="bar-button" onClick={e => {window.location.hash = `#create/${props.focusId}/post`;}}>
	<div class="if-sidebar-block">New Post</div>
</IconButton>;


export default class PageNavBar extends Component {
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
		if ( !this.StartedNotificationLoop ) {
			this.checkNotificationCount();
		}
	}

	componentWillUnmount() {
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
		let Notification = null;
		let ShowUser = null;
		let ShowNotifications = null;

		// Disallow insecure login
		if ( SECURE_LOGIN_ONLY && (location.protocol !== 'https:') ) {
			const SecureURL = 'https://'+location.hostname+location.pathname+location.search+location.hash;
			return <>
				<IconButton icon="unlocked" class="bar-button" noblank href={SecureURL}>
					<div class="if-sidebar-block">Go to Secure Site</div>
				</IconButton>
			</>;
		}
		// Both user and user.id means logged in
		else if ( user && user.id ) {
			if ( featured && featured.id ) {
				// Has a game
				if ( featured.focus_id && featured.what ) {
					return <>
						<MyGameButton href={featured.what[featured.focus_id].path} />
						<NewPostButton focusId={featured.focus_id} />
					</>;
				}
				// Let them create a game
				else if ( node_CanCreate(featured, "item/game") ) {
					return <JoinEventButton eventId={featured.id} />;
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
				<Button title="Notifications" class="bar-icon" onClick={(e) => {
					// TODO: if the main content is the notifications feed, clicking the button should
					// probably not show the dropdown, but load new comments into the feed.
					this.setState({'showNotifications': !this.state.showNotifications});
				}}>
					<Icon baseline>bubble</Icon>
					{NotificationCount}
				</Button>
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
			return <>
				<RegisterNewUserButton />
				<LoginButton />
			</>;
		}
		// Still waiting
		else {
			return <UISpinner />;	// was wrapped in a "fakeright" section
		}

		return <>
			<SearchButton />
			{Notification}
			{ShowNotifications}
			{ShowUser}
			{/*<CalendarButton />*/}
		</>;
	}


	render( props ) {
		const {user, featured, loading, ...otherProps} = props;

		return (
			<nav id="navbar">
				<section class="left">
					<LogoButton />
				</section>
				{loading ? <UISpinner /> : null}
				<section class="right">
					{this.renderRight(user, featured)}
				</section>
			</nav>
		);
	}
}
