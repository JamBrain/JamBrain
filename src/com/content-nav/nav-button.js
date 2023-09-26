import './nav.less';
import { Icon, Button } from 'com/ui';

export default function ContentNavButton( props ) {
	const {icon, light, 'class': classProp, children, ...otherProps} = props;

	const isSelected = ((props.path === props.href) || (props.path === props.match)) ? '-selected' : '';
	// MK TODO: Rename -light to -lit
	const isLit = light ? '-light' : '';
	const hasIcon = icon ? '-has-icon' : '';

	return <Button {...otherProps} class={`${classProp ?? ''} ${isSelected} ${isLit} ${hasIcon}`}>
		{icon ? <Icon src={icon} /> : null}
		{children}
	</Button>;
}
