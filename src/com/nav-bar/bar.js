import { h, Component } 				from 'preact/preact';
import ShallowCompare	 				from 'shallow-compare/index';

import ButtonBase						from '../button-base/base';
import ButtonLink						from '../button-link/link';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

function make_url( url ) {
	return url + window.location.search;
}

export default class NavBar extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
		document.body.classList.add('_use-nav-bar');
	}
	componentWillUnmount() {
		document.body.classList.remove('_use-nav-bar');
		document.body.classList.remove('_static-nav-bar');
	}
	
//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
//		console.log("FOON",com,this.props, nextProps);
//		return com;
//	}
	
	render( {user}, {} ) {
		var Search = null;
//		var Search = (
//			<ButtonBase class="-icon" onclick={e => { console.log('search'); window.location.hash = "#search"; }}>
//				<SVGIcon baseline>search</SVGIcon>
//			</ButtonBase>
//		);
		
		var Calendar = (
			<ButtonBase class="-button if-no-sidebar-block" onclick={e => { console.log('calendar'); window.location.hash = "#cal"; }}>
				<SVGIcon baseline>calendar</SVGIcon>
				<div class="if-sidebar-block">Schedule</div>
			</ButtonBase>		
		);
		
		var MyGame = null;
		var NewPost = null;
		var Notification = null;
		var User = null;
		var Register = null;
		var Login = null;
		var GoSecure = null;

		if ( SECURE_LOGIN_ONLY && (location.protocol !== 'https:') ) {
			let SecureURL = 'https://'+location.hostname+location.pathname+location.search+location.hash;
			GoSecure = (
				<ButtonBase class="-button" href={SecureURL} onclick={e => {console.log('secure'); location.href = SecureURL;}}>
					<SVGIcon>unlocked</SVGIcon>
					<div class="if-sidebar-block">Go to Secure Site</div>
				</ButtonBase>
			);
		}
		else if ( user && user.id ) {
			var GameURL = '/events/ludum-dare/37/theme/';
			// TODO: Check if a participant of the current event
			MyGame = (
				<ButtonLink href={GameURL} class="-button">
					<SVGIcon>gamepad</SVGIcon>
					<div class="if-sidebar-block">Slaughter Themes</div>
				</ButtonLink>
			);
			//"";
//			 (
//				<ButtonBase class="-button" onclick={e => console.log('my game')}>
//					<SVGIcon>gamepad</SVGIcon>
//					<div>My Game</div>
//				</ButtonBase>
//			);
			
			NewPost = (
				<ButtonBase class="-button" onclick={e => { console.log('new'); window.location.hash = "#post-new"; }}>
					<SVGIcon>edit</SVGIcon>
					<div class="if-sidebar-block">New</div>
				</ButtonBase>
			);
			
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
			User = (
				<ButtonBase class="-user">
					<NavLink href={MyURL}>{Avatar}</NavLink>
				</ButtonBase>
			);
		}
		else {
			Register = (
				<ButtonBase class="-button" onclick={e => { console.log('register'); window.location.hash = "#user-register"; }}>
					<SVGIcon>user</SVGIcon>
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
		
		return (
			<div class="nav-bar">
				<div class="-content">
					<div class="-left">
						<ButtonLink href="/" class="-logo">
							<SVGIcon class="if-sidebar-block" baseline>ludum</SVGIcon><SVGIcon class="if-sidebar-block" baseline>dare</SVGIcon>
							<SVGIcon class="if-no-sidebar-block" baseline>l-udum</SVGIcon><SVGIcon class="if-no-sidebar-block" baseline>d-are</SVGIcon>							
						</ButtonLink>
					</div>
					<div class="-right">
						{MyGame}
						{NewPost}
						{Calendar}
						{Search}
						{Notification}
						{User}
						{Register}
						{Login}
						{GoSecure}
					</div>
				</div>
			</div>
		);
	}
}

//export function navbar_Float() {
//	document.body.classList.remove('_static-nav-bar');
//}
//export function navbar_Static() {
//	document.body.classList.add('_static-nav-bar');
//}
