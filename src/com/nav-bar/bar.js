import { h, Component } from 'preact/preact';
import CoreButton		from '../core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class NavBar extends Component {
	render( props, state ) {
		return (
			<div class="nav-bar">
				<div class="-content">
					<div class="-left">
						<SVGIcon>ludum</SVGIcon><SVGIcon>dare</SVGIcon> <SVGIcon>l-udum</SVGIcon><SVGIcon>d-are</SVGIcon><SVGIcon>jam</SVGIcon>
					</div>
					<div class="-right">
						<CoreButton class="-button if-no-sidebar-inline"><SVGIcon>calendar</SVGIcon><span class="if-small-hide">Schedule</span></CoreButton>
						<CoreButton class="-button if-no-sidebar-inline"><SVGIcon>fire</SVGIcon><span class="if-small-hide">Trending</span></CoreButton>
						<CoreButton class="-button"><SVGIcon>search</SVGIcon></CoreButton>
						<CoreButton class="-button"><SVGIcon>question</SVGIcon> What is this?</CoreButton>
						<CoreButton class="-button" onClick={ e => { console.log("moop"); } }><SVGIcon>user</SVGIcon><span>Register</span></CoreButton>
						<CoreButton class="-button" keepFocus><SVGIcon>key</SVGIcon><span>Login</span></CoreButton>
					</div>
				</div>
			</div>
		);
	}

//				<div>
//					<CoreButton class="button" onClick={ navbar_Static }>Static</CoreButton>
//					<CoreButton class="button" onClick={ navbar_Float }>Float</CoreButton>
//					<CoreButton class="button" onClick={ e => { document.activeElement.blur(); } }>Blank</CoreButton>
//				</div>
	
	componentDidMount() {
		document.body.classList.add('_use-nav-bar');
	}
	componentWillUnmount() {
		document.body.classList.remove('_use-nav-bar');
		document.body.classList.remove('_static-nav-bar');
	}
}

export function navbar_Float() {
	document.body.classList.remove('_static-nav-bar');
}
export function navbar_Static() {
	document.body.classList.add('_static-nav-bar');
}
