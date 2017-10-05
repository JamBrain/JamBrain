import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';


export default class ContentNavButton extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}

	render( props, {} ) {
		if ( props.class ) {
			props.class = props.class.split(' ');
		}
		else {
			props.class = [];
		}
		props.class.push('-button');

		if ( props.path === props.href ) {
			props.class.push('-selected');
		}

		var ShowIcon = null;
		if ( props.icon ) {
			ShowIcon = <SVGIcon>{props.icon}</SVGIcon>;
			props.class.push('-has-icon');
		}

		return (
			<NavLink {...props}>{ShowIcon}<span>{props.children}</span></NavLink>
		);
	}
}
