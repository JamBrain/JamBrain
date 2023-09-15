import { Component } from 'preact';
import './checkbox.less';

import { Button } from '../button';
import { Icon } from '../icon';

/** @deprecated */
export class UICheckbox extends Component {
	render( props ) {
		const iconName = (props.radio ? 'radio' : 'checkbox') + (props.value ? '-checked' : '-unchecked');
		return (
			<Button class={`ui-checkbox ${props.class ?? ''}`} onClick={props.onClick} title={props.tooltip} >
				<Icon src={iconName} />
				<span class="-text">{props.children}</span>
			</Button>
		);
	}
}
