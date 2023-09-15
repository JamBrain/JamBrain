import { Component } from 'preact';
import './checkbox.less';

import { UIButton } from '../button';
import { UIIcon } from '../icon';

export default class UICheckbox extends Component {
	render( props ) {
		const iconName = (props.radio ? 'radio' : 'checkbox') + (props.value ? '-checked' : '-unchecked');
		return (
			<UIButton class={`ui-checkbox ${props.class ?? ''}`} onClick={props.onClick} title={props.tooltip} >
				<UIIcon src={iconName} />
				<span class="-text">{props.children}</span>
			</UIButton>
		);
	}
}
