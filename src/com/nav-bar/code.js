import { h, Component } from 'preact/preact';
import CoreButton		from '../core-button/code';
import SVGIcon 			from 'com/svg-icon/code';

export default class NavBar extends Component {
	render(props,state) {
		return (
			<div class="nav-bar">
				<div class="-right">
					<CoreButton class="button" onClick={ e => { console.log("moop"); } }><SVGIcon name="user" /><span>Register</span></CoreButton>
					<CoreButton class="button" keepFocus><SVGIcon name="key" /><span>Login</span></CoreButton>
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
