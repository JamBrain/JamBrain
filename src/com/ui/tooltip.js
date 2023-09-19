import "./tooltip.less";
const ui_tooltip = 'ui_tooltip';

/**
 * @typedef TooltipProps
 * @property {string} text
 * @property {*} children
 * @property {string} [class]
 */

/**
 * Wrap this around any element to add a tooltip
 * @param {TooltipProps} props
 */
export function Tooltip( props ) {
	const {text, children, 'class': classProp, ...otherProps} = props;
	// MK: Lazy version of tooltip
	return <span class={`${ui_tooltip} ${classProp ?? ''}`} title={`TOOLTIP: ${text}`}>{children}</span>;
}
