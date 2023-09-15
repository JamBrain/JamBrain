import {ui_button} from './button.module.less';

export default function UIButton( props ) {
	const {'class': classProp, ...otherProps} = props;
	const classNames = `${ui_button} ${classProp ?? ''}`;
	return (props.href)
		? <a {...otherProps} class={classNames} />
		: <button {...otherProps} type="button" class={classNames} />;
}
