import {h, Component}					from 'preact/preact';
import UIButtonDiv						from 'button-div';
import UIButtonLink						from 'button-link';

export default class UIButton extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		if ( props.href )
			return <UIButtonLink {...props} />;
		return <UIButtonDiv {...props} />;
	}
}
