import {h, Component}					from 'preact/preact';

import UIButton							from '../button/button-div';	// NOTE: we don't need -link
import UIIcon							from '../icon/icon';

export default class UICheckbox extends Component {
	constructor( props ) {
		super( props );

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if ( this.props.onclick )
			this.props.onclick();
	}

	render( props ) {
		return (
			<UIButton class={cN('ui-checkbox', props.class)}>
				<UIIcon>{props.radio ? 'radio' : 'checkbox'}-{props.value ? 'checked' : 'unchecked'}</UIIcon>
				<span class="-text">{props.children}</span>
			</UIButton>
		);
	}
}
