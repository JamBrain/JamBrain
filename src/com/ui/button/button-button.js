import './button-button.less';

/**
 * @typedef {Object} UIButtonButtonProps
 * @prop {string} [class]
 * @prop {boolean} [disabled]
 */

/**
 * @param {UIButtonButtonProps|null} _props
 * @returns {*|null}
 */
export default function UIButtonButton( _props ) {
	const {'class': classNames, ...props} = _props;
	return <button type="button" {...props} class={`ui-button ${classNames ?? ''}`} />;
}
