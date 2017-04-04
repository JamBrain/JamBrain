import { h, Component } 				from 'preact/preact';
import ShallowCompare	 				from 'shallow-compare/index';

import ButtonBase						from '../button-base/base';
import ButtonLink						from '../button-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import NavSpinner						from 'com/nav-spinner/spinner';

import DropdownUser 					from 'com/dropdown-user/user';
import $User							from '../shrub/js/user/user';
//import DropdownNotification				from 'com/dropdown-notification/notification';

function make_url( url ) {
	return url + window.location.search;
}

export default class ViewBar extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
		document.body.classList.add('_use-view-bar');
	}
	componentWillUnmount() {
		document.body.classList.remove('_use-view-bar');
		document.body.classList.remove('_static-view-bar');
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
//		console.log("FOON",com,this.props, nextProps);
//		return com;
//	}

	renderLeft() {

	}

	renderRight( user, featured ) {
		var Search = null;
//		var Search = (
//			<ButtonBase class="-icon" onclick={e => { console.log('search'); window.location.hash = "#search"; }}>
//				<SVGIcon baseline>search</SVGIcon>
//			</ButtonBase>
//		);

		var ShowCalendar = (
			<ButtonBase class="-button if-no-sidebar-block" onclick={e => { console.log('calendar'); window.location.hash = "#cal"; }}>
				<SVGIcon baseline>calendar</SVGIcon>
				<div class="if-sidebar-block">Schedule</div>
			</ButtonBase>
		);

		var ShowJoin = null;
		var ShowMyGame = null;
		var NewPost = null;
		var Notification = null;
		var ShowUser = null;
		var LogOut = null;
		var Register = null;
		var Login = null;
		var GoSecure = null;
		var ShowSpinner = null;

		// Disallow insecure login
		if ( SECURE_LOGIN_ONLY && (location.protocol !== 'https:') ) {
			let SecureURL = 'https://'+location.hostname+location.pathname+location.search+location.hash;
			GoSecure = (
				<ButtonBase class="-button" href={SecureURL} onclick={e => {console.log('secure'); location.href = SecureURL;}}>
					<SVGIcon>unlocked</SVGIcon>
					<div class="if-sidebar-block">Go to Secure Site</div>
				</ButtonBase>
			);
		}
		// Both user and user.id means logged in
		else if ( user && user.id ) {
			if ( featured && featured.id ) {
				if ( featured.what && featured.what.length ) {
					// TODO: get actual URL
					var GameURL = '/events/ludum-dare/37/';
//					var GameURL = '/users/ham/';
					GameURL += '$'+featured.what[featured.what.length-1];
					GameURL += '/edit';

					ShowMyGame = (
						<ButtonLink href={GameURL} class="-button">
							<SVGIcon>gamepad</SVGIcon>
							<div class="if-sidebar-block">My Game</div>
						</ButtonLink>
					);

//					NewPost = (
//						<ButtonBase class="-button" onclick={e => { console.log('new'); window.location.hash = "#create/post"; }}>
//							<SVGIcon>edit</SVGIcon>
//							<div class="if-sidebar-block">New</div>
//						</ButtonBase>
//					);
				}
				else {
					ShowJoin = (
						<ButtonBase class="-button" onclick={e => { window.location.hash = "#create/"+featured.id+"/item/game"; }}>
							<SVGIcon>publish</SVGIcon>
							<div class="if-sidebar-block">Join Event</div>
						</ButtonBase>
					);
				}
			}





			// TODO: Figure out how many notifications a user has
			let NotificationCount = false ? (
				<div class="-new">2</div>
			) : "";
			var Notification = (
				<ButtonBase class="-icon" onclick={e => {console.log('notification'); window.location.hash = "#dummy";}}>
					<SVGIcon baseline>bubble</SVGIcon>
					{NotificationCount}
				</ButtonBase>
			);

			// TODO: Pull this out of the user meta, else use a dummy
			let Avatar = (user.meta && user.meta.avatar) ? <img src={"//"+STATIC_DOMAIN+user.meta.avatar} /> : <img src={'//'+STATIC_DOMAIN+'/other/dummy/user64.png'} />;
			//'/other/logo/mike/Chicken64.png';
			let MyURL = '/users/'+user.slug+'/';
			ShowUser = [
				<ButtonBase class="-user">
					<NavLink href={MyURL}>{Avatar}</NavLink>
				</ButtonBase>,
//				<DropdownUser />
			];

			let LogOutURL = "";
			LogOut = [
				<ButtonBase class="-logout" onclick={e => {$User.Logout();window.location.reload();}}>
					<SVGIcon baseline>logout</SVGIcon>
				</ButtonBase>,
			];
		}
		// If user has finished loading (and is not logged in)
		else if ( user ) {
			Register = (
				<ButtonBase class="-button" onclick={e => { console.log('register'); window.location.hash = "#user-register"; }}>
					<SVGIcon>user-plus</SVGIcon>
					<div class="if-sidebar-block">Create Account</div>
				</ButtonBase>
			);
			Login = (
				<ButtonBase class="-button" onclick={e => { console.log('login'); window.location.hash = "#user-login"; }}>
					<SVGIcon>key</SVGIcon>
					<div class="if-sidebar-block">Login</div>
				</ButtonBase>
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
					{ShowUser}
					{LogOut}
					{Register}
					{Login}
					{GoSecure}
				</div>
			);
		}
	}

	render( {user, featured}, {} ) {
		return (
			<div class="view-bar">
				<div class="-content">
					<div class="-left">
						<ButtonLink href="/" class="-logo">
							<SVGIcon class="if-sidebar-block" baseline>ludum</SVGIcon><SVGIcon class="if-sidebar-block" baseline>dare</SVGIcon>
							<SVGIcon class="if-no-sidebar-block" baseline>l-udum</SVGIcon><SVGIcon class="if-no-sidebar-block" baseline>d-are</SVGIcon>
						</ButtonLink>
					</div>
					{this.renderRight(user, featured)}
				</div>
			</div>
		);
	}
}
