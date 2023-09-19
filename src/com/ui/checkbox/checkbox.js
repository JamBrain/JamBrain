import './checkbox.less';

import { Button } from '../button';
import { Icon } from '../icon';

/** @deprecated */
export function UICheckbox( props ) {
	const icon = (props.radio ? 'radio' : 'checkbox') + (props.value ? '-checked' : '-unchecked');
	return (
		<Button class={`ui-checkbox ${props.class ?? ''}`} onClick={props.onClick} title={props.tooltip} >
			<Icon src={icon} />
			<span class="-text">{props.children}</span>
		</Button>
	);
}
