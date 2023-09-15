import {UIButton as cUIButton} from './button.module.less';

export default function UIButton( props ) {
	const {'class': className, ...otherProps} = props;
	const classes = `${cUIButton} ${className ?? ''}`;
	return (props.href)
		? <a {...otherProps} class={classes} />
		: <button {...otherProps} type="button" class={classes} />;
}
