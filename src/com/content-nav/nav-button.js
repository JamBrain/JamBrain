import './nav.less';
import { Icon, Button } from 'com/ui';

export default function ContentNavButton( props ) {
	const {'class': classProp, children, ...otherProps} = props;

	const selected = ((props.path === props.href) || (props.path === props.match)) ? '-selected' : '';
	const light = props.light ? '-light' : '';
	const icon = props.icon ? '-has-icon' : '';

	return <Button {...otherProps} class={`${classProp ?? ''} ${selected} ${light} ${icon}`}>
		{props.icon ? <Icon src={props.icon} /> : null}
		{children}
	</Button>;
}
