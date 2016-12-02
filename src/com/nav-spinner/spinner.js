import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class NavSpinner extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( props, state ) {
		// NOTE: Needs an extra div for IE, which can't apply transformations to SVG elemenst
		return (
			<div class="nav-spinner"><div><SVGIcon>spinner</SVGIcon></div></div>
		);
	}
}
