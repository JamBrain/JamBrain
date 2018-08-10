import {h, Component}					from 'preact/preact';

import UIButton							from '../button/button-div';	// NOTE: we don't need -link
import UIIcon							from '../icon/icon';

export default class UICheckbox extends Component {
	render( props ) {
		const iconName = (props.radio ? 'radio' : 'checkbox') + (props.value ? '-checked' : '-unchecked');
		return (
			<UIButton class={cN('ui-checkbox', props.class)} onclick={props.onclick} title={props.tooltip} >
				<UIIcon name={iconName} />
				<span class="-text">{props.children}</span>
			</UIButton>
		);
	}
}
