import {h, Component} from 'preact';
import cN from 'classnames';

import UIButton from '../button';
import UIIcon from '../icon';

export default class UICheckbox extends Component {
	render( props ) {
		const iconName = (props.radio ? 'radio' : 'checkbox') + (props.value ? '-checked' : '-unchecked');
		return (
			<UIButton class={cN('ui-checkbox', props.class)} onclick={props.onclick} title={props.tooltip} >
				<UIIcon src={iconName} />
				<span class="-text">{props.children}</span>
			</UIButton>
		);
	}
}
