import { h, Component } from 'preact/preact';

export default class NavLink extends Component {
	
	onClick( e ) {
		if ( this.origin === window.location.origin ) {
			e.preventDefault();
			// TODO: Push state here (arg1) //
			history.pushState(null,null,this.pathname);
		}
		e.stopPropagation();
	}
	
	render( props, state ) {
		props.onclick = this.onClick;
		return (
			<a {...props} />
		);
	}
}
