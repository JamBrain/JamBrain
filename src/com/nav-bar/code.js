import { h, Component } from 'preact/preact';

export default class NavBar extends Component {
	render(props,state) {
		return (
			<div class="nav-bar">
				<div class="box" onClick={ e => navbar_Static() }>Hullo</div>
				<div class="box" onClick={ e => navbar_Float() }>C</div>
				<div class="box">NOO</div>
				<div class="box -right">Well...</div>
				<div class="box -right">Sure</div>
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
