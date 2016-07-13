import { h, Component } from 'preact/preact';
import CoreButton from '../core-button/code';

export default class NavBar extends Component {
	render(props,state) {
		return (
			<div class="nav-bar">
				<div>
					<CoreButton class="button" onClick={ navbar_Static }>Static</CoreButton>
					<CoreButton class="button" onClick={ navbar_Float }>Float</CoreButton>
					<CoreButton class="button" onClick={ e => { document.activeElement.blur(); } }>Blank</CoreButton>
				</div>
				<div class="-right">
					<CoreButton class="button" onClick={ e => { console.log("moop"); } }>And that is it</CoreButton>
					<CoreButton class="button" keepFocus>Dude...?</CoreButton>
				</div>
			</div>
		);
	}
	
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
