import {h, Component} from 'preact';
import UIButtonDiv from './button-div';
import UIButtonLink from './button-link';

export default function UIButton( props ) {
	return (props.href) ? <UIButtonLink {...props} /> : <UIButtonDiv {...props} />;
}

/*
export default class UIButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (props.href) ? <UIButtonLink {...props} /> : <UIButtonDiv {...props} />;
	}
}
*/
